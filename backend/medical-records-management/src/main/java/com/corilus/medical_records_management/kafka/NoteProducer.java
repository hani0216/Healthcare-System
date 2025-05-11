package com.corilus.medical_records_management.kafka;

import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.entity.Note;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.corilus.medical_records_management.repository.NoteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class NoteProducer {

    private static final String TOPIC = "medical-note-topic";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final NoteRepository noteRepository;
    private final ObjectMapper objectMapper;
    private final MedicalRecordRepository medicalRecordRepository;

    @Autowired
    public NoteProducer(KafkaTemplate<String, String> kafkaTemplate,
                        NoteRepository noteRepository,
                        ObjectMapper objectMapper,
                        MedicalRecordRepository medicalRecordRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.noteRepository = noteRepository;
        this.objectMapper = objectMapper;
        this.medicalRecordRepository = medicalRecordRepository;
    }

    public void sendNoteCreatedMessage(Long noteId, String title, String creationTime) {
        Note note = noteRepository.findById(noteId).orElse(null);
        MedicalRecord medicalRecord = medicalRecordRepository.findByNoteId(noteId).orElse(null);
        Long patientId = medicalRecord != null ? medicalRecord.getPatientId() : null;
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "CREATED");
        payload.put("title", title);
        payload.put("patientId", patientId);
        payload.put("eventTime", creationTime);
        sendMessage(payload);
    }

    public void sendNoteUpdatedMessage(Long noteId, String title, String updateTime) {
        Note note = noteRepository.findById(noteId).orElse(null);
        MedicalRecord medicalRecord = medicalRecordRepository.findByNoteId(noteId).orElse(null);
        Long patientId = medicalRecord != null ? medicalRecord.getPatientId() : null;
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "UPDATED");
        payload.put("title", title);
        payload.put("patientId", patientId);
        payload.put("eventTime", updateTime);
        sendMessage(payload);
    }

    public void sendNoteDeletedMessage(Long noteId, String title, String deletionTime) {
        Note note = noteRepository.findById(noteId).orElse(null);
        MedicalRecord medicalRecord = medicalRecordRepository.findByNoteId(noteId).orElse(null);
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
