package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.DocumentDto;
import com.corilus.medical_records_management.entity.Document;

import java.util.List;

public interface DocumentService {

    Document createDocument(Long medicalRecordId, DocumentDto documentDto);

    void removeDocument(Long id);

    Document updateDocument(Long id, DocumentDto documentDto);

    List<Document> getDocumentsByPatient(Long patientId);

    List<Document> getDocumentsByMedicalRecord(Long id);

    Document getDocumentById(Long id);
}
