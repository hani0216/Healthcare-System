package com.corilus.medical_records_management.controller;

import com.corilus.medical_records_management.entity.Authorizations;
import com.corilus.medical_records_management.enums.AuthorizationStatus;
import com.corilus.medical_records_management.service.AuthorizationsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.corilus.medical_records_management.dto.AddStatusRequest;

@RestController
@RequestMapping("/api/authorizations")
public class AuthorizationController {

    private final AuthorizationsService authorizationsService;

    public AuthorizationController(AuthorizationsService authorizationsService) {
        this.authorizationsService = authorizationsService;
    }

    @PostMapping("/add-doctor")
    public ResponseEntity<Authorizations> addDoctor(@RequestParam int doctorId) {
        Authorizations authorizations = authorizationsService.addDoctor(doctorId);
        return ResponseEntity.ok(authorizations);
    }

    @GetMapping("/status")
    public ResponseEntity<String> getAuthorizationStatus(
            @RequestParam int doctorId,
            @RequestParam int medicalRecordId) {
        AuthorizationStatus status = authorizationsService.getAuthorizationStatus(doctorId, medicalRecordId);
        return ResponseEntity.ok(status != null ? status.name() : "UNKNOWN");
    }

    @PostMapping("/add-status")
    public ResponseEntity<Void> addStatus(@RequestBody AddStatusRequest request) {
        authorizationsService.addStatus(request.getDoctorId(), request.getMedicalRecordId(), request.getStatus());
        return ResponseEntity.ok().build();
    }
}