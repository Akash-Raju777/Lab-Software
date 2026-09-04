package com.labtrack.service;

import com.labtrack.dto.AlertItemResponse;
import com.labtrack.dto.InventorySummaryResponse;
import com.labtrack.dto.ReagentRequest;
import com.labtrack.dto.ReagentResponse;
import com.labtrack.enums.ReagentStatus;
import com.labtrack.exception.ResourceNotFoundException;
import com.labtrack.model.Reagent;
import com.labtrack.repository.ReagentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReagentServiceImpl implements ReagentService {

    private static final Logger log = LoggerFactory.getLogger(ReagentServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");

    private final ReagentRepository reagentRepository;

    @Value("${labtrack.expiry.threshold-days:7}")
    private int thresholdDays;

    public ReagentServiceImpl(ReagentRepository reagentRepository) {
        this.reagentRepository = reagentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReagentResponse> getAllReagents(String search, ReagentStatus statusFilter, String sortBy, String sortDir) {
        LocalDate today = LocalDate.now();
        List<Reagent> reagents;

        if (search != null && !search.trim().isEmpty()) {
            reagents = reagentRepository.findByNameContainingIgnoreCaseOrderByExpiryDateAsc(search.trim());
        } else {
            reagents = reagentRepository.findAllByOrderByExpiryDateAsc();
        }

        List<ReagentResponse> responses = reagents.stream()
                .map(r -> mapToResponse(r, today))
                .filter(r -> statusFilter == null || r.getStatus() == statusFilter)
                .collect(Collectors.toList());

        if (sortBy != null) {
            boolean isAsc = sortDir == null || sortDir.equalsIgnoreCase("asc");
            Comparator<ReagentResponse> comparator;

            switch (sortBy.toLowerCase()) {
                case "name":
                    comparator = Comparator.comparing(r -> r.getName().toLowerCase());
                    break;
                case "quantity":
                    comparator = Comparator.comparing(ReagentResponse::getQuantity);
                    break;
                case "status":
                    comparator = Comparator.comparing(ReagentResponse::getStatus);
                    break;
                case "createdat":
                    comparator = Comparator.comparing(ReagentResponse::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
                    break;
                case "expirydate":
                default:
                    comparator = Comparator.comparing(ReagentResponse::getExpiryDate);
                    break;
            }

            if (!isAsc) {
                comparator = comparator.reversed();
            }

            responses.sort(comparator);
        }

        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public ReagentResponse getReagentById(Long id) {
        Reagent reagent = reagentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reagent not found with ID: " + id));
        return mapToResponse(reagent, LocalDate.now());
    }

    @Override
    @Transactional
    public ReagentResponse createReagent(ReagentRequest request) {
        log.info("Creating new reagent: {}", request.getName());

        Reagent reagent = Reagent.builder()
                .name(request.getName().trim())
                .quantity(request.getQuantity())
                .unit(request.getUnit().trim())
                .expiryDate(request.getExpiryDate())
                .build();

        Reagent saved = reagentRepository.save(reagent);
        log.info("Successfully created reagent ID: {}", saved.getId());
        return mapToResponse(saved, LocalDate.now());
    }

    @Override
    @Transactional
    public void deleteReagent(Long id) {
        log.info("Deleting reagent ID: {}", id);
        if (!reagentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reagent not found with ID: " + id);
        }
        reagentRepository.deleteById(id);
        log.info("Successfully deleted reagent ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public InventorySummaryResponse getInventorySummary() {
        LocalDate today = LocalDate.now();
        List<Reagent> all = reagentRepository.findAll();

        long goodCount = 0;
        long expiringSoonCount = 0;
        long expiredCount = 0;

        for (Reagent reagent : all) {
            ReagentStatus status = calculateStatus(reagent.getExpiryDate(), today);
            switch (status) {
                case GOOD:
                    goodCount++;
                    break;
                case EXPIRING_SOON:
                    expiringSoonCount++;
                    break;
                case EXPIRED:
                    expiredCount++;
                    break;
            }
        }

        return InventorySummaryResponse.builder()
                .totalReagents(all.size())
                .goodCount(goodCount)
                .expiringSoonCount(expiringSoonCount)
                .expiredCount(expiredCount)
                .calculationDate(today)
                .thresholdDays(thresholdDays)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlertItemResponse> getExpiryAlerts() {
        LocalDate today = LocalDate.now();
        List<Reagent> all = reagentRepository.findAllByOrderByExpiryDateAsc();
        List<AlertItemResponse> alerts = new ArrayList<>();

        for (Reagent r : all) {
            ReagentStatus status = calculateStatus(r.getExpiryDate(), today);
            if (status == ReagentStatus.GOOD) {
                continue;
            }

            long diff = ChronoUnit.DAYS.between(today, r.getExpiryDate());
            String msg;
            if (status == ReagentStatus.EXPIRED) {
                long daysAgo = Math.abs(diff);
                msg = r.getName() + " expired on " + r.getExpiryDate().format(DATE_FORMATTER) +
                        (daysAgo > 0 ? " (" + daysAgo + " day" + (daysAgo > 1 ? "s" : "") + " ago)" : "");
            } else {
                if (diff == 0) {
                    msg = r.getName() + " expires today (" + r.getExpiryDate().format(DATE_FORMATTER) + ")";
                } else {
                    msg = r.getName() + " expires in " + diff + " day" + (diff > 1 ? "s" : "") +
                            " (" + r.getExpiryDate().format(DATE_FORMATTER) + ")";
                }
            }

            AlertItemResponse alert = AlertItemResponse.builder()
                    .id(r.getId())
                    .name(r.getName())
                    .quantity(r.getQuantity())
                    .unit(r.getUnit())
                    .expiryDate(r.getExpiryDate())
                    .status(status)
                    .daysDifference(diff)
                    .alertMessage(msg)
                    .build();

            alerts.add(alert);
        }

        return alerts;
    }

    private ReagentStatus calculateStatus(LocalDate expiryDate, LocalDate today) {
        if (expiryDate.isBefore(today)) {
            return ReagentStatus.EXPIRED;
        }
        long daysUntil = ChronoUnit.DAYS.between(today, expiryDate);
        if (daysUntil <= thresholdDays) {
            return ReagentStatus.EXPIRING_SOON;
        }
        return ReagentStatus.GOOD;
    }

    private ReagentResponse mapToResponse(Reagent reagent, LocalDate today) {
        ReagentStatus status = calculateStatus(reagent.getExpiryDate(), today);
        long days = ChronoUnit.DAYS.between(today, reagent.getExpiryDate());

        String message;
        if (status == ReagentStatus.EXPIRED) {
            long daysAgo = Math.abs(days);
            message = "Expired " + daysAgo + " day" + (daysAgo > 1 ? "s" : "") + " ago";
        } else if (status == ReagentStatus.EXPIRING_SOON) {
            if (days == 0) {
                message = "Expires today";
            } else {
                message = "Expires in " + days + " day" + (days > 1 ? "s" : "");
            }
        } else {
            message = "Good (" + days + " days remaining)";
        }

        return ReagentResponse.builder()
                .id(reagent.getId())
                .name(reagent.getName())
                .quantity(reagent.getQuantity())
                .unit(reagent.getUnit())
                .expiryDate(reagent.getExpiryDate())
                .createdAt(reagent.getCreatedAt())
                .status(status)
                .statusDisplayName(status.getDisplayName())
                .daysUntilExpiry(days)
                .statusMessage(message)
                .build();
    }
}
