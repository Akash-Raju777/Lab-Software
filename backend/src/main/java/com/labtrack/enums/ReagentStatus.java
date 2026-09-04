package com.labtrack.enums;

public enum ReagentStatus {
    GOOD("Good"),
    EXPIRING_SOON("Expiring Soon"),
    EXPIRED("Expired");

    private final String displayName;

    ReagentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
