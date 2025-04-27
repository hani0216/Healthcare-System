package com.corilus.medical_records_management.controller;

import com.corilus.medical_records_management.client.DoctorClient;
import com.corilus.medical_records_management.dto.*;
import com.corilus.medical_records_management.entity.*;
import com.corilus.medical_records_management.service.DocumentService;
import com.corilus.medical_records_management.service.MedicalRecordService;
import com.corilus.medical_records_management.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.corilus.medical_records_management.service.HistoryService;
import com.corilus.medical_records_management.enums.HistoryType;
import com.corilus.medical_records_management.service.NoteService;
import com.corilus.medical_records_management.kafka.MedicalRecordProducer;


import java.sql.Timestamp;
import java.util.List;



@RestController
@RequestMapping("/medical-records")
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
    private final NoteService noteService;
    @Autowired
    private final AppointmentService appointmentService;
    @Autowired
    private final MedicalRecordProducer medicalRecordProducer;




    @PostMapping
    public ResponseEntity<Long> createMedicalRecord(@RequestBody @Valid MedicalRecordDto medicalRecordDto) {
        Long idMedicalRecord = medicalRecordService.createMedicalRecord(medicalRecordDto);
        return ResponseEntity.ok(idMedicalRecord);
    }


    @PutMapping("addLog/{medicalRecordId}/history/{historyId}")
    public ResponseEntity<Long> updateMedicalRecord(
            @PathVariable Long medicalRecordId,
            @PathVariable Long historyId ) {
        try {
            medicalRecordService.addHistoryToMedicalRecord(medicalRecordId, historyId);
            return ResponseEntity.ok(medicalRecordId);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
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
            medicalRecordProducer.sendDocumentDeletedMessage(
                    document.getMedicalRecord(),
                    document.getName(),
                    document.getCreationDate().toString()
            );
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


    @PutMapping("/{recordId}/updateNoteForMr/{doctorId}")
    public ResponseEntity<Note> updateNoteForMedicalRecord(
            @PathVariable Long recordId,
            @PathVariable Long doctorId,
            @RequestBody NoteDto noteDto) {

        Note existingNote = noteService.getNoteByMedicalRecord(recordId);

        existingNote.setTitle(noteDto.getTitle());
        existingNote.setDescription(noteDto.getDescription());
        existingNote.setAuthorId(doctorId);
        existingNote.setDate(new Timestamp(System.currentTimeMillis()));

        Note updatedNote = noteService.updateNote(existingNote.getId(), noteDto);

        return new ResponseEntity<>(updatedNote, HttpStatus.OK);
    }

    @PostMapping("/{medicalRecordId}/addDocument")
    public ResponseEntity<Document> addDocumentToMedicalRecord(
            @PathVariable Long medicalRecordId, @RequestBody @Valid DocumentDto documentDto) {
        Document createdDocument = documentService.createDocument(medicalRecordId, documentDto);
        MedicalRecord medicalRecord = medicalRecordService.getMedicalRecordById(medicalRecordId);
        return ResponseEntity.ok(createdDocument);
    }

    @PostMapping("/document/{documentId}/addNoteForDocument/{doctorId}")
    public ResponseEntity<Note> createNoteForDocument(
            @PathVariable Long documentId,
            @PathVariable Long doctorId,
            @RequestBody NoteDto noteDto) {

        Note createdNote = noteService.createNoteForDocument(documentId, doctorId, noteDto);
        return new ResponseEntity<>(createdNote, HttpStatus.CREATED);
    }

    @GetMapping("/getNoteByDocument/{documentId}")
    public ResponseEntity<Note> getNotesByDocument(
            @PathVariable Long documentId,
            @RequestBody NoteDto noteDto) {

        Note notes = noteService.getNotesByDocument(documentId, noteDto);
        return new ResponseEntity<>(notes, HttpStatus.OK);
    }

    @GetMapping("/note/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        Note note = noteService.getNoteById(id);
        return new ResponseEntity<>(note, HttpStatus.OK);
    }
    @GetMapping("/getNoteByMedicalRecord/{id}")
    public ResponseEntity<Note> getNoteByMedicalRecord(@PathVariable Long id){
        Note note = noteService.getNoteByMedicalRecord(id);
        return new ResponseEntity<>(note , HttpStatus.OK);
    }

    @PutMapping("/noteDocument/{id}")
    public ResponseEntity<Note> updateNote(
            @PathVariable Long id,
            @RequestBody NoteDto noteDto) {

        Note updatedNote = noteService.updateNote(id, noteDto);
        return new ResponseEntity<>(updatedNote, HttpStatus.OK);
    }
    @DeleteMapping("/deleteNoteFromDocument/{documentId}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long documentId) {
        noteService.deleteNoteFromDocument(documentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @DeleteMapping("/appointment/{appointmentId}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/appointmentBypatient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByUser(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByUser(patientId));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(appointmentId));
    }
    @PutMapping("/appointment/{appointmentId}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long appointmentId,
            @RequestBody AppointmentDto appointmentDto) {
        return ResponseEntity.ok(
                appointmentService.updateAppointment( appointmentId, appointmentDto)
        );
    }


    @PostMapping("/addAppointment/{medicalRecordId}")
    public ResponseEntity<Appointment> createAppointment(
            @PathVariable Long medicalRecordId,
            @RequestBody AppointmentDto appointmentDto) {
        return new ResponseEntity<>(
                appointmentService.createAppointment(medicalRecordId, appointmentDto),
                HttpStatus.CREATED
        );
    }











}
