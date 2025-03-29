package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.DocumentDto;
import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.repository.DocumentRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.corilus.medical_records_management.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Override
    public Document createDocument(Long medicalRecordId, DocumentDto documentDto) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        Document document = new Document();
        document.setName(documentDto.getName());
        document.setContent(documentDto.getContent());
        document.setCreationDate(new Date());

        Document saved = documentRepository.save(document);

        medicalRecord.getDocuments().add(saved);
        medicalRecordRepository.save(medicalRecord);

        return saved;
    }

    @Override
    public void removeDocument(Long id) {
        documentRepository.deleteById(id);
    }

    @Override
    public Document updateDocument(Long id, DocumentDto documentDto) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        document.setName(documentDto.getName());
        document.setContent(documentDto.getContent());

        return documentRepository.save(document);
    }

    @Override
    public Document getDocumentsByPatient(Long patientId) {
        return documentRepository.findFirstByMedicalRecord_PatientId(patientId)
                .orElseThrow(() -> new RuntimeException("No document found for patient"));
    }

    @Override
    public List<Document> getDocumentsByMedicalRecord(Long id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
        return record.getDocuments();
    }

    @Override
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }
}
