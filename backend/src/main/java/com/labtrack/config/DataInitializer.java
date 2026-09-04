package com.labtrack.config;

import com.labtrack.model.Reagent;
import com.labtrack.model.UserProfile;
import com.labtrack.repository.ReagentRepository;
import com.labtrack.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ReagentRepository reagentRepository;
    private final UserProfileRepository userProfileRepository;

    public DataInitializer(ReagentRepository reagentRepository, UserProfileRepository userProfileRepository) {
        this.reagentRepository = reagentRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public void run(String... args) {
        // 1. Seed User Profiles if not present
        if (userProfileRepository.count() == 0) {
            log.info("Populating initial laboratory user profiles...");
            UserProfile admin = UserProfile.builder()
                    .username("admin")
                    .email("admin@labtrack.com")
                    .fullName("Dr. Sarah Mitchell")
                    .password("labpassword123")
                    .role("ADMIN")
                    .department("Clinical Microbiology & Serology")
                    .expiryThresholdDays(7)
                    .enableEmailAlerts(true)
                    .build();

            UserProfile staff = UserProfile.builder()
                    .username("staff")
                    .email("staff@labtrack.com")
                    .fullName("Alex Chen, MLS(ASCP)")
                    .password("staff123")
                    .role("STAFF")
                    .department("Bacteriology Bench")
                    .expiryThresholdDays(7)
                    .enableEmailAlerts(false)
                    .build();

            userProfileRepository.saveAll(Arrays.asList(admin, staff));
            log.info("Initialized default laboratory users successfully.");
        }
        if (reagentRepository.count() == 0) {
            log.info("Populating initial microbiology laboratory inventory sample data...");
            LocalDate today = LocalDate.now();

            List<Reagent> initialReagents = Arrays.asList(
                    // GOOD Reagents (> 7 days)
                    Reagent.builder()
                            .name("Nutrient Agar")
                            .quantity(new BigDecimal("500.00"))
                            .unit("g")
                            .expiryDate(today.plusDays(45))
                            .createdAt(OffsetDateTime.now().minusDays(10))
                            .build(),
                    Reagent.builder()
                            .name("MacConkey Agar")
                            .quantity(new BigDecimal("500.00"))
                            .unit("g")
                            .expiryDate(today.plusDays(30))
                            .createdAt(OffsetDateTime.now().minusDays(8))
                            .build(),
                    Reagent.builder()
                            .name("Blood Agar Base")
                            .quantity(new BigDecimal("500.00"))
                            .unit("g")
                            .expiryDate(today.plusDays(120))
                            .createdAt(OffsetDateTime.now().minusDays(20))
                            .build(),
                    Reagent.builder()
                            .name("Hydrogen Peroxide 3% (Catalase)")
                            .quantity(new BigDecimal("100.00"))
                            .unit("mL")
                            .expiryDate(today.plusDays(90))
                            .createdAt(OffsetDateTime.now().minusDays(5))
                            .build(),
                    Reagent.builder()
                            .name("Mueller-Hinton Agar")
                            .quantity(new BigDecimal("500.00"))
                            .unit("g")
                            .expiryDate(today.plusDays(60))
                            .createdAt(OffsetDateTime.now().minusDays(15))
                            .build(),
                    Reagent.builder()
                            .name("Phenol Red Broth Base")
                            .quantity(new BigDecimal("250.00"))
                            .unit("g")
                            .expiryDate(today.plusDays(180))
                            .createdAt(OffsetDateTime.now().minusDays(25))
                            .build(),
                    Reagent.builder()
                            .name("Simmons Citrate Agar")
                            .quantity(new BigDecimal("250.00"))
                            .unit("g")
                            .expiryDate(today.plusDays(15))
                            .createdAt(OffsetDateTime.now().minusDays(4))
                            .build(),

                    // EXPIRING SOON Reagents (0 to 7 days)
                    Reagent.builder()
                            .name("Gram Crystal Violet Solution")
                            .quantity(new BigDecimal("250.00"))
                            .unit("mL")
                            .expiryDate(today.plusDays(4))
                            .createdAt(OffsetDateTime.now().minusDays(30))
                            .build(),
                    Reagent.builder()
                            .name("Gram Iodine Solution")
                            .quantity(new BigDecimal("250.00"))
                            .unit("mL")
                            .expiryDate(today.plusDays(2))
                            .createdAt(OffsetDateTime.now().minusDays(30))
                            .build(),
                    Reagent.builder()
                            .name("Ethanol 70% Disinfectant")
                            .quantity(new BigDecimal("1000.00"))
                            .unit("mL")
                            .expiryDate(today.plusDays(6))
                            .createdAt(OffsetDateTime.now().minusDays(12))
                            .build(),
                    Reagent.builder()
                            .name("Oxidase Test Reagent (1% TMPD)")
                            .quantity(new BigDecimal("30.00"))
                            .unit("mL")
                            .expiryDate(today.plusDays(5))
                            .createdAt(OffsetDateTime.now().minusDays(20))
                            .build(),

                    // EXPIRED Reagents (< 0 days)
                    Reagent.builder()
                            .name("Gram Safranin Counterstain")
                            .quantity(new BigDecimal("250.00"))
                            .unit("mL")
                            .expiryDate(today.minusDays(3))
                            .createdAt(OffsetDateTime.now().minusDays(45))
                            .build(),
                    Reagent.builder()
                            .name("Kovacs Reagent (Indole Test)")
                            .quantity(new BigDecimal("50.00"))
                            .unit("mL")
                            .expiryDate(today.minusDays(12))
                            .createdAt(OffsetDateTime.now().minusDays(60))
                            .build(),
                    Reagent.builder()
                            .name("Sabouraud Dextrose Agar")
                            .quantity(new BigDecimal("500.00"))
                            .unit("g")
                            .expiryDate(today.minusDays(1))
                            .createdAt(OffsetDateTime.now().minusDays(40))
                            .build()
            );

            reagentRepository.saveAll(initialReagents);
            log.info("Initialized {} microbiology reagents successfully.", initialReagents.size());
        }
    }
}
