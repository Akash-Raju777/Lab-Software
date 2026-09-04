package com.labtrack.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class LabSettingsRequest {

    @NotNull(message = "Expiry threshold days is required")
    @Min(value = 1, message = "Threshold must be at least 1 day")
    @Max(value = 90, message = "Threshold cannot exceed 90 days")
    private Integer expiryThresholdDays;

    @NotNull(message = "Enable email alerts flag is required")
    private Boolean enableEmailAlerts;

    public LabSettingsRequest() {}

    public LabSettingsRequest(Integer expiryThresholdDays, Boolean enableEmailAlerts) {
        this.expiryThresholdDays = expiryThresholdDays;
        this.enableEmailAlerts = enableEmailAlerts;
    }

    public Integer getExpiryThresholdDays() { return expiryThresholdDays; }
    public void setExpiryThresholdDays(Integer expiryThresholdDays) { this.expiryThresholdDays = expiryThresholdDays; }

    public Boolean getEnableEmailAlerts() { return enableEmailAlerts; }
    public void setEnableEmailAlerts(Boolean enableEmailAlerts) { this.enableEmailAlerts = enableEmailAlerts; }
}
