package com.labtrack.service;

import com.labtrack.dto.LoginRequest;
import com.labtrack.dto.LoginResponse;
import com.labtrack.model.UserProfile;
import com.labtrack.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserProfileRepository userProfileRepository;

    public AuthService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Transactional
    public LoginResponse authenticate(LoginRequest request) {
        String identifier = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();

        // 1. Try finding in database
        Optional<UserProfile> userOpt = userProfileRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(identifier, identifier);

        if (userOpt.isPresent()) {
            UserProfile user = userOpt.get();
            if (user.getPassword().equals(password)) {
                String token = "labtrack-jwt-" + UUID.randomUUID().toString();
                log.info("Successful database login for user: {}", user.getEmail());
                return LoginResponse.builder()
                        .token(token)
                        .email(user.getEmail())
                        .name(user.getFullName())
                        .role(user.getRole())
                        .message("Authentication successful")
                        .build();
            }
        } else {
            // 2. Fallback check for initial admin/staff and auto-seed
            if ("admin@labtrack.com".equalsIgnoreCase(identifier) && "labpassword123".equals(password)) {
                UserProfile admin = UserProfile.builder()
                        .username("admin")
                        .email("admin@labtrack.com")
                        .fullName("Dr. Sarah Mitchell")
                        .password("labpassword123")
                        .role("ADMIN")
                        .department("Clinical Microbiology")
                        .build();
                UserProfile saved = userProfileRepository.save(admin);
                String token = "labtrack-jwt-" + UUID.randomUUID().toString();
                return LoginResponse.builder()
                        .token(token)
                        .email(saved.getEmail())
                        .name(saved.getFullName())
                        .role(saved.getRole())
                        .message("Authentication successful")
                        .build();
            }
        }

        log.warn("Failed login attempt for identifier: {}", identifier);
        throw new IllegalArgumentException("Invalid laboratory email/username or password. Please check your credentials.");
    }
}
