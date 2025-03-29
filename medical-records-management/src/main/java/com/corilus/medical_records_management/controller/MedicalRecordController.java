package com.corilus.medical_records_management.controller;

import com.corilus.medical_records_management.dto.MedicalRecordDto;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.service.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(@RequestBody @Valid MedicalRecordDto medicalRecordDto) {
        MedicalRecord created = medicalRecordService.createMedicalRecord(medicalRecordDto);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordByPatientId(@PathVariable Long id) {
        MedicalRecord record = medicalRecordService.getMedicalRecordByPatientId(id);
        return ResponseEntity.ok(record);
    }

    @GetMapping("/patient-name/{name}")
    public ResponseEntity<MedicalRecord> getMedicalRecordByPatientName(@PathVariable String name) {
        MedicalRecord record = medicalRecordService.getMedicalRecordByPatientName(name);
        return ResponseEntity.ok(record);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long id) {
        MedicalRecord record = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(record);
    }
}
