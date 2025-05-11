package com.corilus.medical_records_management.kafka;

import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class MedicalRecordProducer {

    private static final String TOPIC = "medical-record-topic";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final MedicalRecordRepository medicalRecordRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public MedicalRecordProducer(KafkaTemplate<String, String> kafkaTemplate, MedicalRecordRepository medicalRecordRepository, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.medicalRecordRepository = medicalRecordRepository;
        this.objectMapper = objectMapper;
    }

    public void sendDocumentCreatedMessage(Long medicalRecordId, String title, String creationTime) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId).orElse(null);
        Long patientId = medicalRecord != null ? medicalRecord.getPatientId() : null;
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "CREATED");
        payload.put("title", title);
        payload.put("patientId", patientId);
        payload.put("eventTime", creationTime);
        sendMessage(payload);
    }

    public void sendDocumentUpdatedMessage(Long medicalRecordId, String title, String updateTime) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId).orElse(null);
        Long patientId = medicalRecord != null ? medicalRecord.getPatientId() : null;
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "UPDATED");
        payload.put("title", title);
        payload.put("patientId", patientId);
        payload.put("eventTime", updateTime);
        sendMessage(payload);
    }

    public void sendDocumentDeletedMessage(Long medicalRecordId, String title, String deletionTime) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId).orElse(null);
        Long patientId = medicalRecord != null ? medicalRecord.getPatientId() : null;
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "DELETED");
        payload.put("title", title);
        payload.put("patientId", patientId);
        payload.put("eventTime", deletionTime);
        sendMessage(payload);
    }

    private void sendMessage(Map<String, Object> payload) {
        try {
            String message = objectMapper.writeValueAsString(payload);
            kafkaTemplate.send(TOPIC, message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
