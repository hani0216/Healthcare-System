package com.corilus.medical_records_management.kafka;

import com.corilus.medical_records_management.entity.Appointment;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.repository.AppointmentRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AppointmentProducer {

    private static final String TOPIC = "medical-appointment-topic";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public AppointmentProducer(KafkaTemplate<String, String> kafkaTemplate,
                               AppointmentRepository appointmentRepository,
                               MedicalRecordRepository medicalRecordRepository,
                               ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.objectMapper = objectMapper;
    }

    public void sendAppointmentCreatedMessage(Long appointmentId, String title, String creationTime) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        MedicalRecord medicalRecord = medicalRecordRepository.findByAppointments_Id(appointmentId).orElse(null);
        Long patientId = medicalRecord != null ? medicalRecord.getPatientId() : null;
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "CREATED");
        payload.put("title", title);
        payload.put("patientId", patientId);
        payload.put("eventTime", creationTime);
        sendMessage(payload);
    }

    public void sendAppointmentUpdatedMessage(Long appointmentId, String title, String updateTime) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        MedicalRecord medicalRecord = medicalRecordRepository.findByAppointments_Id(appointmentId).orElse(null);
        Long patientId = medicalRecord != null ? medicalRecord.getPatientId() : null;
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "UPDATED");
        payload.put("title", title);
        payload.put("patientId", patientId);
        payload.put("eventTime", updateTime);
        sendMessage(payload);
    }

    public void sendAppointmentDeletedMessage(Long appointmentId, String title, String deletionTime) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        MedicalRecord medicalRecord = medicalRecordRepository.findByAppointments_Id(appointmentId).orElse(null);
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
