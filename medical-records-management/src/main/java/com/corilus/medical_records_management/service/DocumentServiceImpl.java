package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.DocumentDto;
import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.enums.HistoryType;
import com.corilus.medical_records_management.repository.DocumentRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.corilus.medical_records_management.service.MedicalRecordService;
import java.util.Date;
import java.util.List;
import com.corilus.medical_records_management.entity.MedicalRecord;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final HistoryService historyService;
    private final MedicalRecordService medicalRecordService;


    @Override
    public Document createDocument(Long medicalRecordId, DocumentDto documentDto) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        Document document = new Document();
        document.setName(documentDto.getName());
        document.setContent(documentDto.getContent());
        document.setCreationDate(new Date());
        document.setMedicalRecord(medicalRecordId);
        document.setUploadedById(documentDto.getUploadedById());

        Document saved = documentRepository.save(document);

        medicalRecord.getDocuments().add(saved);
        medicalRecordRepository.save(medicalRecord);

        historyService.createHistory(medicalRecord.getId(), HistoryType.DOCUMENT_UPLOADED);

        return saved;
    }

    @Override
    public void removeDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        MedicalRecord medicalRecord = medicalRecordRepository.findByDocumentsContaining(document)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

      /*  historyService.createHistory(medicalRecord.getId(), HistoryType.DOCUMENT_DELETED);*/
        medicalRecord.getLogs().add(0, historyService.createHistory(medicalRecord.getId(), HistoryType.DOCUMENT_DELETED));


        medicalRecord.getDocuments().remove(document);
        medicalRecordRepository.save(medicalRecord);

        documentRepository.deleteById(id);
    }

    @Override
    public Document updateDocument(Long id, DocumentDto documentDto) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        document.setName(documentDto.getName());
        document.setContent(documentDto.getContent());

        Document updated = documentRepository.save(document);

        MedicalRecord medicalRecord = medicalRecordRepository.findByDocumentsContaining(document)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        historyService.createHistory(medicalRecord.getId(), HistoryType.DOCUMENT_UPDATED);

        return updated;
    }

    @Override
    public List<Document> getAllDocuments(){
        return documentRepository.findAll();
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

    @Transactional
    public void deleteDocument(Long documentId) {
        medicalRecordService.removeDocumentFromMedicalRecord(documentId);
        documentRepository.deleteById(documentId);

    }

    @Override
    public void removeDocumentFromMedicalRecord(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }


}
