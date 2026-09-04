package com.labtrack.dto;

import java.time.LocalDate;

public class InventorySummaryResponse {

    private long totalReagents;
    private long goodCount;
    private long expiringSoonCount;
    private long expiredCount;
    private LocalDate calculationDate;
    private int thresholdDays;

    public InventorySummaryResponse() {}

    public InventorySummaryResponse(long totalReagents, long goodCount, long expiringSoonCount, long expiredCount, LocalDate calculationDate, int thresholdDays) {
        this.totalReagents = totalReagents;
        this.goodCount = goodCount;
        this.expiringSoonCount = expiringSoonCount;
        this.expiredCount = expiredCount;
        this.calculationDate = calculationDate;
        this.thresholdDays = thresholdDays;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalReagents;
        private long goodCount;
        private long expiringSoonCount;
        private long expiredCount;
        private LocalDate calculationDate;
        private int thresholdDays;

        public Builder totalReagents(long totalReagents) { this.totalReagents = totalReagents; return this; }
        public Builder goodCount(long goodCount) { this.goodCount = goodCount; return this; }
        public Builder expiringSoonCount(long expiringSoonCount) { this.expiringSoonCount = expiringSoonCount; return this; }
        public Builder expiredCount(long expiredCount) { this.expiredCount = expiredCount; return this; }
        public Builder calculationDate(LocalDate calculationDate) { this.calculationDate = calculationDate; return this; }
        public Builder thresholdDays(int thresholdDays) { this.thresholdDays = thresholdDays; return this; }

        public InventorySummaryResponse build() {
            return new InventorySummaryResponse(totalReagents, goodCount, expiringSoonCount, expiredCount, calculationDate, thresholdDays);
        }
    }

    // Getters and Setters
    public long getTotalReagents() { return totalReagents; }
    public void setTotalReagents(long totalReagents) { this.totalReagents = totalReagents; }

    public long getGoodCount() { return goodCount; }
    public void setGoodCount(long goodCount) { this.goodCount = goodCount; }

    public long getExpiringSoonCount() { return expiringSoonCount; }
    public void setExpiringSoonCount(long expiringSoonCount) { this.expiringSoonCount = expiringSoonCount; }

    public long getExpiredCount() { return expiredCount; }
    public void setExpiredCount(long expiredCount) { this.expiredCount = expiredCount; }

    public LocalDate getCalculationDate() { return calculationDate; }
    public void setCalculationDate(LocalDate calculationDate) { this.calculationDate = calculationDate; }

    public int getThresholdDays() { return thresholdDays; }
    public void setThresholdDays(int thresholdDays) { this.thresholdDays = thresholdDays; }
}
