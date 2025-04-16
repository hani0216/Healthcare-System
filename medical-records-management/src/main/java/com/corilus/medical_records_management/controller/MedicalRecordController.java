package com.corilus.medical_records_management.controller;

import com.corilus.medical_records_management.client.DoctorClient;
import com.corilus.medical_records_management.dto.DoctorDto;
import com.corilus.medical_records_management.dto.DocumentDto;
import com.corilus.medical_records_management.dto.MedicalRecordDto;
import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.service.DocumentService;
import com.corilus.medical_records_management.service.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.corilus.medical_records_management.service.HistoryService;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.corilus.medical_records_management.enums.HistoryType;
import java.io.IOException;
import java.util.List;
@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    @Autowired
    private final MedicalRecordService medicalRecordService;
    @Autowired
    private DoctorClient doctorClient;
    @Autowired
    private DocumentService documentService;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @PostMapping
    public ResponseEntity<Long> createMedicalRecord(@RequestBody @Valid MedicalRecordDto medicalRecordDto) {
        Long idMedicalRecord = medicalRecordService.createMedicalRecord(medicalRecordDto);
        return ResponseEntity.ok(idMedicalRecord);
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
        MedicalRecord medicalRecord = medicalRecordService.getMedicalRecordById(id);
        historyService.createHistory(medicalRecord.getId(), HistoryType.MEDICAL_RECORD_DELETED);
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

    @GetMapping
    public ResponseEntity<List<MedicalRecord>> getAllMedicalRecords(){
        List<MedicalRecord> medicalRecords = medicalRecordService.getAllMedicalRecords();
        return ResponseEntity.ok(medicalRecords);
    }

    @PostMapping("/{medicalRecordId}/addDocument")
    public ResponseEntity<Document> addDocumentToMedicalRecord(@PathVariable Long medicalRecordId, @RequestBody @Valid DocumentDto documentDto) {
        Document createdDocument = documentService.createDocument(medicalRecordId, documentDto);
        MedicalRecord medicalRecord = medicalRecordService.getMedicalRecordById(medicalRecordId);
        return ResponseEntity.ok(createdDocument);
    }

    @GetMapping("/document/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/documents")
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @DeleteMapping("/document/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId) {
        try {
            documentService.deleteDocument(documentId);
            Document document = documentService.getDocumentById(documentId);
            MedicalRecord medicalRecord = medicalRecordService.getMedicalRecordById(document.getMedicalRecord());
            historyService.createHistory(medicalRecord.getId(), HistoryType.DOCUMENT_DELETED);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }

    @GetMapping("/{medicalRecordId}/documents")
    public ResponseEntity<List<Document>> getDocumentsByMedicalRecord(@PathVariable Long medicalRecordId) {
        List<Document> documents = documentService.getDocumentsByMedicalRecord(medicalRecordId);
        return ResponseEntity.ok(documents);
    }

    @PutMapping("/document/{documentId}")
    public ResponseEntity<Void> updateDocument(@PathVariable Long documentId, @RequestBody @Valid DocumentDto documentDto) {
        documentService.updateDocument(documentId, documentDto);
        Document document = documentService.getDocumentById(documentId);
        MedicalRecord medicalRecord = medicalRecordService.getMedicalRecordById(document.getMedicalRecord());

        return ResponseEntity.noContent().build();
    }
}
