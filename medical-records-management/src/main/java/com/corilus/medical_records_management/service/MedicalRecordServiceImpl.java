package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.client.DoctorClient;
import com.corilus.medical_records_management.client.PatientClient;
import com.corilus.medical_records_management.dto.DoctorDto;
import com.corilus.medical_records_management.dto.MedicalRecordDto;
import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.entity.Note;
import com.corilus.medical_records_management.enums.HistoryType;
import com.corilus.medical_records_management.repository.HistoryRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import feign.FeignException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.corilus.medical_records_management.repository.DocumentRepository;
import com.corilus.medical_records_management.entity.History;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final DoctorClient doctorClient;
    private final PatientClient patientClient;
    private final DocumentRepository documentRepository;
    private final HistoryRepository historyRepository;
    private final HistoryService historyService;

    @Override
    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    public Long findPatientIdByName(String name) {
        try {
            Long patientId = patientClient.getPatientIdByName(name);
            if (patientId != null) {
                return patientId;
            } else {
                throw new PatientNotFoundException("No patient found with name: " + name);
            }
        } catch (FeignException e) {
            throw new RuntimeException("Failed to fetch patient ID for name: " + name, e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error occurred while fetching patient ID for name: " + name, e);
        }
    }

    public class PatientNotFoundException extends RuntimeException {
        public PatientNotFoundException(String message) {
            super(message);
        }
    }

    @Override
    @Transactional
    public void addHistoryToMedicalRecord(Long medicalRecordId, Long historyId) {
        Logger log = LoggerFactory.getLogger(MedicalRecordService.class);

        try {
            log.info("Starting addHistoryToMedicalRecord with medicalRecordId: {} and historyId: {}", medicalRecordId, historyId);

            MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId)
                    .orElseThrow(() -> new RuntimeException("Medical record not found"));
            log.info("Found medical record: {}", medicalRecord);

            History history = historyRepository.findById(historyId)
                    .orElseThrow(() -> new RuntimeException("History not found"));
            log.info("Found history: {}", history);

            medicalRecord.getLogs().add(history);
            log.info("History added to medical record logs");

            historyRepository.save(history);
            log.info("History saved: {}", history);

            medicalRecord.getLogs().add(0, history);
            medicalRecordRepository.save(medicalRecord);
            log.info("Medical record saved with updated logs");

        } catch (Exception e) {
            log.error("Error in addHistoryToMedicalRecord: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public Long createMedicalRecord(MedicalRecordDto medicalRecordDto) {
        MedicalRecord record = new MedicalRecord();
        record.setPatientId(medicalRecordDto.getPatientId());
        record.setNote(new Note());
        record.setDocuments(new ArrayList<>());
        record.setAppointments(new ArrayList<>());
        record.setLogs(new ArrayList<>());
        MedicalRecord savedRecord = medicalRecordRepository.save(record);
        History createdLog = historyService.createHistory(savedRecord.getId(), HistoryType.MEDICAL_RECORD_CREATED);
        createdLog.setMedicalRecord(savedRecord);
        savedRecord.getLogs().add(0, createdLog);
        medicalRecordRepository.save(savedRecord);
        return savedRecord.getId();
    }


    @Override
    public MedicalRecord getMedicalRecordByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId)
                .orElseThrow(() -> new RuntimeException("Medical record not found for patientId: " + patientId));
    }


    @Override
    public MedicalRecord getMedicalRecordByPatientName(String name) {
        Long patientId = findPatientIdByName(name);
        return getMedicalRecordByPatientId(patientId);
    }

    @Override
    public MedicalRecord getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id));
    }

    private boolean validateDoctor(Long doctorId) {
        try {
            DoctorDto doctor = doctorClient.getDoctorById(doctorId);
            return doctor != null;
        } catch (Exception e) {
            return false;
        }
    }


    @Override
    public List<MedicalRecord> getAllMedicalRecords(){
        return medicalRecordRepository.findAll();
    }



    @Transactional
    public void removeDocumentFromMedicalRecord(Long documentId) {
        MedicalRecord medicalRecord = medicalRecordRepository.findMedicalRecordByDocumentId(documentId);
        if (medicalRecord != null) {
            Optional<Document> documentToRemove = medicalRecord.getDocuments().stream()
                    .filter(doc -> doc.getId().equals(documentId))
                    .findFirst();

            documentToRemove.ifPresent(document -> {
                medicalRecord.getDocuments().remove(document);
                medicalRecordRepository.save(medicalRecord);
                historyService.createHistory(medicalRecord.getId(), HistoryType.DOCUMENT_DELETED);
            });
        }
    }
}
