package com.labtrack.dto;

import java.time.OffsetDateTime;

public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String department;
    private Integer expiryThresholdDays;
    private Boolean enableEmailAlerts;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public UserProfileResponse() {}

    public UserProfileResponse(Long id, String username, String email, String fullName,
                               String role, String department, Integer expiryThresholdDays,
                               Boolean enableEmailAlerts, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.department = department;
        this.expiryThresholdDays = expiryThresholdDays;
        this.enableEmailAlerts = enableEmailAlerts;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String role;
        private String department;
        private Integer expiryThresholdDays;
        private Boolean enableEmailAlerts;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder department(String department) { this.department = department; return this; }
        public Builder expiryThresholdDays(Integer expiryThresholdDays) { this.expiryThresholdDays = expiryThresholdDays; return this; }
        public Builder enableEmailAlerts(Boolean enableEmailAlerts) { this.enableEmailAlerts = enableEmailAlerts; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public UserProfileResponse build() {
            return new UserProfileResponse(id, username, email, fullName, role, department,
                    expiryThresholdDays, enableEmailAlerts, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getExpiryThresholdDays() { return expiryThresholdDays; }
    public void setExpiryThresholdDays(Integer expiryThresholdDays) { this.expiryThresholdDays = expiryThresholdDays; }

    public Boolean getEnableEmailAlerts() { return enableEmailAlerts; }
    public void setEnableEmailAlerts(Boolean enableEmailAlerts) { this.enableEmailAlerts = enableEmailAlerts; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
