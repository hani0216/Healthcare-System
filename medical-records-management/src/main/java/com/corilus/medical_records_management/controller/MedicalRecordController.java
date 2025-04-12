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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


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
        return ResponseEntity.ok(createdDocument);
    }

    /*@PostMapping("/{medicalRecordId}/addDocument2")
    public ResponseEntity<Document> addDocumentToMedicalRecord(
            @PathVariable Long medicalRecordId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("uploadedById") Long uploadedById) throws IOException {

        DocumentDto documentDto = new DocumentDto();
        documentDto.setContent(file.getBytes());
        documentDto.setName(name);
        documentDto.setUploadedById(uploadedById);

        Document createdDocument = documentService.createDocument(medicalRecordId, documentDto);
        return ResponseEntity.ok(createdDocument);
    }


    @DeleteMapping("/{medicalRecordId}/removeDocument/{documentId}")
    public ResponseEntity<Void> removeDocumentFromMedicalRecord(@PathVariable Long medicalRecordId, @PathVariable Long documentId) {
        documentService.removeDocument(documentId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{medicalRecordId}/updateDocument/{documentId}")
    public ResponseEntity<Document> updateDocumentInMedicalRecord(@PathVariable Long medicalRecordId, @PathVariable Long documentId, @RequestBody @Valid DocumentDto documentDto) {
        Document updatedDocument = documentService.updateDocument(documentId, documentDto);
        return ResponseEntity.ok(updatedDocument);
    }*/


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
        documentService.deleteDocument(documentId);
        return ResponseEntity.noContent().build();
    }







}
