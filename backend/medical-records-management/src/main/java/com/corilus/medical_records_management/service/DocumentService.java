package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.DocumentDto;
import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.entity.MedicalRecord;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface DocumentService {

    Document createDocument(Long medicalRecordId, DocumentDto documentDto);

    void deleteDocument(Long documentId);

    Document updateDocument(Long id, DocumentDto documentDto);

    void removeDocumentFromMedicalRecord(Long documentId);

    List<Document> getDocumentsByMedicalRecord(Long id);

    Document getDocumentById(Long id);

    List<Document> getAllDocuments();

    void removeDocument(Long id);

    Long getPatientIdByDocumentId(Long documentId);


}


