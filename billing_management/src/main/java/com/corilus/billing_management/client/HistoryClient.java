package com.corilus.billing_management.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "medical-records-service", url = "${services.medical-records.url}")
public interface HistoryClient {

    @PostMapping("/api/history/{medicalRecordId}")
    void createHistory(@PathVariable("medicalRecordId") Long medicalRecordId, 
                       @RequestParam("type") String historyType);
}