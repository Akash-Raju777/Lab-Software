package com.labtrack.service;

import com.labtrack.dto.AlertItemResponse;
import com.labtrack.dto.InventorySummaryResponse;
import com.labtrack.dto.ReagentRequest;
import com.labtrack.dto.ReagentResponse;
import com.labtrack.enums.ReagentStatus;

import java.util.List;

public interface ReagentService {

    List<ReagentResponse> getAllReagents(String search, ReagentStatus status, String sortBy, String sortDir);

    ReagentResponse getReagentById(Long id);

    ReagentResponse createReagent(ReagentRequest request);

    void deleteReagent(Long id);

    InventorySummaryResponse getInventorySummary();

    List<AlertItemResponse> getExpiryAlerts();
}
