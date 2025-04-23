package com.corilus.billing_management.client;

import com.corilus.billing_management.enums.HistoryType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "medical-records-service", url = "http://localhost:8082")
public interface HistoryClient {
    @PostMapping("/api/history/{medicalRecordId}")
    void createHistory(@PathVariable("medicalRecordId") Long medicalRecordId, 
                      @RequestParam("type") HistoryType type);
}
