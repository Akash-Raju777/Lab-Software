package com.labtrack.dto;

import com.labtrack.enums.ReagentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public class AlertItemResponse {

    private Long id;
    private String name;
    private BigDecimal quantity;
    private String unit;
    private LocalDate expiryDate;
    private ReagentStatus status;
    private long daysDifference;
    private String alertMessage;

    public AlertItemResponse() {}

    public AlertItemResponse(Long id, String name, BigDecimal quantity, String unit, LocalDate expiryDate,
                             ReagentStatus status, long daysDifference, String alertMessage) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
        this.status = status;
        this.daysDifference = daysDifference;
        this.alertMessage = alertMessage;
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
        private ReagentStatus status;
        private long daysDifference;
        private String alertMessage;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder quantity(BigDecimal quantity) { this.quantity = quantity; return this; }
        public Builder unit(String unit) { this.unit = unit; return this; }
        public Builder expiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; return this; }
        public Builder status(ReagentStatus status) { this.status = status; return this; }
        public Builder daysDifference(long daysDifference) { this.daysDifference = daysDifference; return this; }
        public Builder alertMessage(String alertMessage) { this.alertMessage = alertMessage; return this; }

        public AlertItemResponse build() {
            return new AlertItemResponse(id, name, quantity, unit, expiryDate, status, daysDifference, alertMessage);
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

    public ReagentStatus getStatus() { return status; }
    public void setStatus(ReagentStatus status) { this.status = status; }

    public long getDaysDifference() { return daysDifference; }
    public void setDaysDifference(long daysDifference) { this.daysDifference = daysDifference; }

    public String getAlertMessage() { return alertMessage; }
    public void setAlertMessage(String alertMessage) { this.alertMessage = alertMessage; }
}
