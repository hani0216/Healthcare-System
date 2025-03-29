package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.MedicalRecordDto;
import com.corilus.medical_records_management.entity.MedicalRecord;

public interface MedicalRecordService {

    MedicalRecord createMedicalRecord(MedicalRecordDto medicalRecordDto);

    void deleteMedicalRecord(Long id);

    MedicalRecord getMedicalRecordByPatientId(Long patientId);

    MedicalRecord getMedicalRecordByPatientName(String name);

    MedicalRecord getMedicalRecordById(Long id);
}
