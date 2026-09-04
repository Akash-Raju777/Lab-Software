package com.labtrack.service;

import com.labtrack.dto.ChangePasswordRequest;
import com.labtrack.dto.LabSettingsRequest;
import com.labtrack.dto.UpdateProfileRequest;
import com.labtrack.dto.UserProfileResponse;

public interface SettingsService {
    UserProfileResponse getProfile(String emailOrUsername);
    UserProfileResponse updateProfile(String currentIdentifier, UpdateProfileRequest request);
    void changePassword(String currentIdentifier, ChangePasswordRequest request);
    UserProfileResponse getLabPreferences(String currentIdentifier);
    UserProfileResponse updateLabPreferences(String currentIdentifier, LabSettingsRequest request);
}
