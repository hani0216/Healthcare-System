package com.corilus.medical_records_management.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "patient-service", url = "http://localhost:8081")
public interface PatientClient {

    @GetMapping("/patients/getPatientIdByName")
    Long getPatientIdByName(@RequestParam("name") String name);
}
