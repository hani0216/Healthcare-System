package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.MedicalRecordDto;
import com.corilus.medical_records_management.entity.MedicalRecord;
import java.util.List;
public interface MedicalRecordService {

    Long createMedicalRecord(MedicalRecordDto medicalRecordDto);

    void addHistoryToMedicalRecord(Long medicalRecordId, Long historyId);

    void deleteMedicalRecord(Long id);

    MedicalRecord getMedicalRecordByPatientId(Long patientId);

    MedicalRecord getMedicalRecordByPatientName(String name);

    MedicalRecord getMedicalRecordById(Long id);

    Long findPatientIdByName(String name);

    List<MedicalRecord> getAllMedicalRecords();

    void removeDocumentFromMedicalRecord(Long documentId);


}
