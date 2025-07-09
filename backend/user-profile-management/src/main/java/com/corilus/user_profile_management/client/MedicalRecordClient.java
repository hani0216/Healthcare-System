package com.corilus.user_profile_management.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import com.corilus.user_profile_management.dto.MedicalRecordDto;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "medical-record-service",
        url = "http://medical-records-management:8082",
        configuration = MedicalRecordClientConfig.class
)
public interface MedicalRecordClient {
    @PostMapping("/medical-records")
    ResponseEntity<Long> createMedicalRecord(@RequestBody MedicalRecordDto medicalRecordDto);
}