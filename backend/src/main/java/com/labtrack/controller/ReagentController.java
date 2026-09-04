package com.labtrack.controller;

import com.labtrack.dto.AlertItemResponse;
import com.labtrack.dto.ApiResponse;
import com.labtrack.dto.InventorySummaryResponse;
import com.labtrack.dto.ReagentRequest;
import com.labtrack.dto.ReagentResponse;
import com.labtrack.enums.ReagentStatus;
import com.labtrack.service.ReagentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reagents")
public class ReagentController {

    private final ReagentService reagentService;

    public ReagentController(ReagentService reagentService) {
        this.reagentService = reagentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReagentResponse>>> getAllReagents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ReagentStatus status,
            @RequestParam(required = false, defaultValue = "expiryDate") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir) {

        List<ReagentResponse> reagents = reagentService.getAllReagents(search, status, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(reagents));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReagentResponse>> getReagentById(@PathVariable Long id) {
        ReagentResponse reagent = reagentService.getReagentById(id);
        return ResponseEntity.ok(ApiResponse.success(reagent));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReagentResponse>> createReagent(@Valid @RequestBody ReagentRequest request) {
        ReagentResponse created = reagentService.createReagent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Reagent successfully recorded in laboratory inventory"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReagent(@PathVariable Long id) {
        reagentService.deleteReagent(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Reagent successfully removed from inventory"));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ReagentResponse>>> getReagentsByStatus(@PathVariable ReagentStatus status) {
        List<ReagentResponse> reagents = reagentService.getAllReagents(null, status, "expiryDate", "asc");
        return ResponseEntity.ok(ApiResponse.success(reagents));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<InventorySummaryResponse>> getInventorySummary() {
        InventorySummaryResponse summary = reagentService.getInventorySummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<AlertItemResponse>>> getExpiryAlerts() {
        List<AlertItemResponse> alerts = reagentService.getExpiryAlerts();
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }
}
