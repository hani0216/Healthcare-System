package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.AppointmentDto;
import com.corilus.medical_records_management.entity.Appointment;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.enums.HistoryType;
import com.corilus.medical_records_management.enums.Status;
import com.corilus.medical_records_management.enums.Type;
import com.corilus.medical_records_management.kafka.AppointmentProducer;
import com.corilus.medical_records_management.repository.AppointmentRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final HistoryService historyService;
    @Autowired
    private AppointmentProducer appointmentProducer;

    @Override
    public Appointment createAppointment(Long medicalRecordId, AppointmentDto dto) {
        MedicalRecord record = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        Appointment appointment = new Appointment();
        appointment.setDate(dto.getDate());
        appointment.setTitle(dto.getTitle());
        appointment.setStatus(Optional.ofNullable(dto.getStatus()).orElse(Status.SCHEDULED));
        appointment.setType(dto.getType());
        appointment.setMedicalRecord(record);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        historyService.createHistory(record.getId(), HistoryType.APPOINTMENT_ADDED);

        appointmentProducer.sendAppointmentCreatedMessage(savedAppointment.getId(), savedAppointment.getTitle(), savedAppointment.getDate().toString());

        return savedAppointment;
    }

    @Override
    public Appointment updateAppointment(Long appointmentId, AppointmentDto dto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        MedicalRecord record = appointment.getMedicalRecord();
        if (record == null) {
            throw new RuntimeException("Appointment has no associated medical record");
        }

        appointment.setDate(dto.getDate());
        appointment.setTitle(dto.getTitle());
        appointment.setStatus(dto.getStatus() != null ? dto.getStatus() : Status.SCHEDULED);
        appointment.setType(dto.getType() != null ? dto.getType() : Type.MEDICAL_APPOINTMENT);

        Appointment updatedAppointment = appointmentRepository.save(appointment);

        historyService.createHistory(record.getId(), HistoryType.APPOINTMENT_UPDATED);

        appointmentProducer.sendAppointmentUpdatedMessage(updatedAppointment.getId(), updatedAppointment.getTitle(), updatedAppointment.getDate().toString());

        return updatedAppointment;
    }

    @Override
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        MedicalRecord record = appointment.getMedicalRecord();

        historyService.createHistory(record.getId(), HistoryType.APPOINTMENT_DELETED);

        appointmentProducer.sendAppointmentDeletedMessage(appointment.getId(), appointment.getTitle(), java.time.Instant.now().toString());

        appointmentRepository.deleteById(id);
    }

    @Override
    public List<Appointment> getAppointmentsByUser(Long patientId) {
        return appointmentRepository.findByMedicalRecord_PatientId(patientId);
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }
}
