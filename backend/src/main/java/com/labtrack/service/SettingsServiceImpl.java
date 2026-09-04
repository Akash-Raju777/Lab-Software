package com.labtrack.service;

import com.labtrack.dto.ChangePasswordRequest;
import com.labtrack.dto.LabSettingsRequest;
import com.labtrack.dto.UpdateProfileRequest;
import com.labtrack.dto.UserProfileResponse;
import com.labtrack.exception.ResourceNotFoundException;
import com.labtrack.model.UserProfile;
import com.labtrack.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsServiceImpl implements SettingsService {

    private static final Logger log = LoggerFactory.getLogger(SettingsServiceImpl.class);

    private final UserProfileRepository userProfileRepository;

    public SettingsServiceImpl(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    @Transactional
    public UserProfileResponse getProfile(String emailOrUsername) {
        UserProfile user = findOrCreateUser(emailOrUsername);
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String currentIdentifier, UpdateProfileRequest request) {
        log.info("Updating profile for identifier: {}", currentIdentifier);
        UserProfile user = findOrCreateUser(currentIdentifier);

        // Check unique username
        if (userProfileRepository.existsByUsernameIgnoreCaseAndIdNot(request.getUsername().trim(), user.getId())) {
            throw new IllegalArgumentException("Username '" + request.getUsername().trim() + "' is already taken.");
        }

        // Check unique email
        if (userProfileRepository.existsByEmailIgnoreCaseAndIdNot(request.getEmail().trim(), user.getId())) {
            throw new IllegalArgumentException("Email '" + request.getEmail().trim() + "' is already registered to another account.");
        }

        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setFullName(request.getFullName().trim());
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment().trim());
        }

        UserProfile saved = userProfileRepository.save(user);
        log.info("Profile updated successfully for user ID: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void changePassword(String currentIdentifier, ChangePasswordRequest request) {
        log.info("Attempting password change for identifier: {}", currentIdentifier);
        UserProfile user = findOrCreateUser(currentIdentifier);

        if (!user.getPassword().equals(request.getCurrentPassword())) {
            throw new IllegalArgumentException("Current password does not match our records.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match.");
        }

        if (request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters in length.");
        }

        user.setPassword(request.getNewPassword());
        userProfileRepository.save(user);
        log.info("Password successfully updated for user ID: {}", user.getId());
    }

    @Override
    @Transactional
    public UserProfileResponse getLabPreferences(String currentIdentifier) {
        UserProfile user = findOrCreateUser(currentIdentifier);
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateLabPreferences(String currentIdentifier, LabSettingsRequest request) {
        log.info("Updating laboratory preferences for user: {}", currentIdentifier);
        UserProfile user = findOrCreateUser(currentIdentifier);

        user.setExpiryThresholdDays(request.getExpiryThresholdDays());
        user.setEnableEmailAlerts(request.getEnableEmailAlerts());

        UserProfile saved = userProfileRepository.save(user);
        return mapToResponse(saved);
    }

    public UserProfile findOrCreateUser(String identifier) {
        if (identifier == null || identifier.trim().isEmpty() || "default".equalsIgnoreCase(identifier)) {
            identifier = "admin@labtrack.com";
        }

        String search = identifier.trim();
        return userProfileRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(search, search)
                .orElseGet(() -> {
                    // Seed initial admin user if not found
                    log.info("Seeding initial admin user for identifier: {}", search);
                    UserProfile defaultAdmin = UserProfile.builder()
                            .username("admin")
                            .email("admin@labtrack.com")
                            .fullName("Dr. Sarah Mitchell")
                            .password("labpassword123")
                            .role("ADMIN")
                            .department("Clinical Microbiology & Serology")
                            .expiryThresholdDays(7)
                            .enableEmailAlerts(true)
                            .build();
                    return userProfileRepository.save(defaultAdmin);
                });
    }

    private UserProfileResponse mapToResponse(UserProfile user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .department(user.getDepartment())
                .expiryThresholdDays(user.getExpiryThresholdDays() != null ? user.getExpiryThresholdDays() : 7)
                .enableEmailAlerts(user.getEnableEmailAlerts() != null ? user.getEnableEmailAlerts() : true)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
