package com.corilus.medical_records_management.controller;

import com.corilus.medical_records_management.client.DoctorClient;
import com.corilus.medical_records_management.dto.DoctorDto;
import com.corilus.medical_records_management.dto.MedicalRecordDto;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.service.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.corilus.medical_records_management.client.PatientClient;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    @Autowired
    private final MedicalRecordService medicalRecordService;
    @Autowired
    private DoctorClient doctorClient;
    @Autowired
    private PatientClient patientClient;

    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(@RequestBody @Valid MedicalRecordDto medicalRecordDto) {
        MedicalRecord created = medicalRecordService.createMedicalRecord(medicalRecordDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/patient-name/{name}")
    public ResponseEntity<MedicalRecord> getMedicalRecordByPatientName(@PathVariable String name) {
        MedicalRecord record = medicalRecordService.getMedicalRecordByPatientName(name);
        return ResponseEntity.ok(record);
    }

    @GetMapping("/find-patient-id/{name}")
    public ResponseEntity<Long> getPatientIdByName(@PathVariable String name) {
        Long patientId = medicalRecordService.findPatientIdByName(name);
        return ResponseEntity.ok(patientId);
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

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long id) {
        MedicalRecord record = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(record);
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<DoctorDto> getDoctorById(@PathVariable Long id) {
        DoctorDto doctor = doctorClient.getDoctorById(id);
        return ResponseEntity.ok(doctor);
    }
}
