package com.labtrack.dto;

import com.labtrack.enums.ReagentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public class ReagentResponse {

    private Long id;
    private String name;
    private BigDecimal quantity;
    private String unit;
    private LocalDate expiryDate;
    private OffsetDateTime createdAt;
    private ReagentStatus status;
    private String statusDisplayName;
    private long daysUntilExpiry;
    private String statusMessage;

    public ReagentResponse() {}

    public ReagentResponse(Long id, String name, BigDecimal quantity, String unit, LocalDate expiryDate,
                           OffsetDateTime createdAt, ReagentStatus status, String statusDisplayName,
                           long daysUntilExpiry, String statusMessage) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
        this.status = status;
        this.statusDisplayName = statusDisplayName;
        this.daysUntilExpiry = daysUntilExpiry;
        this.statusMessage = statusMessage;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private BigDecimal quantity;
        private String unit;
        private LocalDate expiryDate;
        private OffsetDateTime createdAt;
        private ReagentStatus status;
        private String statusDisplayName;
        private long daysUntilExpiry;
        private String statusMessage;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder quantity(BigDecimal quantity) { this.quantity = quantity; return this; }
        public Builder unit(String unit) { this.unit = unit; return this; }
        public Builder expiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder status(ReagentStatus status) { this.status = status; return this; }
        public Builder statusDisplayName(String statusDisplayName) { this.statusDisplayName = statusDisplayName; return this; }
        public Builder daysUntilExpiry(long daysUntilExpiry) { this.daysUntilExpiry = daysUntilExpiry; return this; }
        public Builder statusMessage(String statusMessage) { this.statusMessage = statusMessage; return this; }

        public ReagentResponse build() {
            return new ReagentResponse(id, name, quantity, unit, expiryDate, createdAt, status, statusDisplayName, daysUntilExpiry, statusMessage);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public ReagentStatus getStatus() { return status; }
    public void setStatus(ReagentStatus status) { this.status = status; }

    public String getStatusDisplayName() { return statusDisplayName; }
    public void setStatusDisplayName(String statusDisplayName) { this.statusDisplayName = statusDisplayName; }

    public long getDaysUntilExpiry() { return daysUntilExpiry; }
    public void setDaysUntilExpiry(long daysUntilExpiry) { this.daysUntilExpiry = daysUntilExpiry; }

    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }
}
