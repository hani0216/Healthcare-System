package com.corilus.notification_management.client;

import com.corilus.notification_management.dto.AddStatusRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cloud.openfeign.FeignClient;



@FeignClient(name = "MEDICAL-RECORDS-MANAGEMENT", url = "http://medical-records-management:8082")
public interface AuthorizationClient {

    @PostMapping("/api/authorizations/add-status")
    ResponseEntity<String> addStatus(@RequestBody AddStatusRequest dto);

}

