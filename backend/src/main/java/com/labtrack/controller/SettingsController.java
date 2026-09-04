package com.labtrack.controller;

import com.labtrack.dto.ApiResponse;
import com.labtrack.dto.ChangePasswordRequest;
import com.labtrack.dto.LabSettingsRequest;
import com.labtrack.dto.UpdateProfileRequest;
import com.labtrack.dto.UserProfileResponse;
import com.labtrack.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @RequestParam(required = false, defaultValue = "admin@labtrack.com") String identifier) {
        UserProfileResponse response = settingsService.getProfile(identifier);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @RequestParam(required = false, defaultValue = "admin@labtrack.com") String identifier,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse response = settingsService.updateProfile(identifier, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile settings updated successfully"));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestParam(required = false, defaultValue = "admin@labtrack.com") String identifier,
            @Valid @RequestBody ChangePasswordRequest request) {
        settingsService.changePassword(identifier, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password updated successfully"));
    }

    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getPreferences(
            @RequestParam(required = false, defaultValue = "admin@labtrack.com") String identifier) {
        UserProfileResponse response = settingsService.getLabPreferences(identifier);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updatePreferences(
            @RequestParam(required = false, defaultValue = "admin@labtrack.com") String identifier,
            @Valid @RequestBody LabSettingsRequest request) {
        UserProfileResponse response = settingsService.updateLabPreferences(identifier, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Laboratory preferences updated successfully"));
    }
}
