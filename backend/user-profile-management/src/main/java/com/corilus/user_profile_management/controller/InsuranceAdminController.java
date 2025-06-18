package com.corilus.user_profile_management.controller;

import com.corilus.user_profile_management.dto.InsuranceAdminDto;
import com.corilus.user_profile_management.entity.InsuranceAdmin;
import com.corilus.user_profile_management.service.InsuranceAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/insurance-admins")
public class InsuranceAdminController {

    private final InsuranceAdminService insuranceAdminService;

    public InsuranceAdminController(InsuranceAdminService insuranceAdminService) {
        this.insuranceAdminService = insuranceAdminService;
    }

    @PostMapping
    public ResponseEntity<InsuranceAdmin> createInsuranceAdmin(@RequestBody InsuranceAdminDto dto) {
        return ResponseEntity.ok(insuranceAdminService.createInsuranceAdmin(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsuranceAdmin> updateInsuranceAdmin(@PathVariable Long id, @RequestBody InsuranceAdminDto dto) {
        return ResponseEntity.ok(insuranceAdminService.updateInsuranceAdmin(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInsuranceAdmin(@PathVariable Long id) {
        insuranceAdminService.deleteInsuranceAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<InsuranceAdmin>> getAllInsuranceAdmins() {
        return ResponseEntity.ok(insuranceAdminService.getAllInsuranceAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsuranceAdmin> getInsuranceAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(insuranceAdminService.getInsuranceById(id));
    }

    @GetMapping("/insuranceByName/{insuranceCompany}")
    public ResponseEntity<List<InsuranceAdmin>> getInsuranceAdminsByCompany(@PathVariable String insuranceCompany) {
        return ResponseEntity.ok(insuranceAdminService.getInsuranceAdminsByCompany(insuranceCompany));
    }
}
