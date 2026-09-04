package com.labtrack.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String role; // ADMIN, STAFF

    @Column(length = 100)
    private String department;

    @Column(name = "expiry_threshold_days")
    private Integer expiryThresholdDays = 7;

    @Column(name = "enable_email_alerts")
    private Boolean enableEmailAlerts = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public UserProfile() {
    }

    public UserProfile(Long id, String username, String email, String fullName, String password,
                       String role, String department, Integer expiryThresholdDays,
                       Boolean enableEmailAlerts, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.role = role;
        this.department = department;
        this.expiryThresholdDays = expiryThresholdDays != null ? expiryThresholdDays : 7;
        this.enableEmailAlerts = enableEmailAlerts != null ? enableEmailAlerts : true;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = OffsetDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String password;
        private String role = "ADMIN";
        private String department = "Microbiology";
        private Integer expiryThresholdDays = 7;
        private Boolean enableEmailAlerts = true;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder department(String department) { this.department = department; return this; }
        public Builder expiryThresholdDays(Integer expiryThresholdDays) { this.expiryThresholdDays = expiryThresholdDays; return this; }
        public Builder enableEmailAlerts(Boolean enableEmailAlerts) { this.enableEmailAlerts = enableEmailAlerts; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public UserProfile build() {
            return new UserProfile(id, username, email, fullName, password, role, department,
                    expiryThresholdDays, enableEmailAlerts, createdAt, updatedAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

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
