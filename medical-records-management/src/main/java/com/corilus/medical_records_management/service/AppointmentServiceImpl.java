package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.AppointmentDto;
import com.corilus.medical_records_management.entity.Appointment;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.enums.HistoryType;
import com.corilus.medical_records_management.repository.AppointmentRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.corilus.medical_records_management.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final HistoryService historyService;

    @Override
    public Appointment createAppointment(Long medicalRecordId, AppointmentDto dto) {
        MedicalRecord record = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        Appointment appointment = new Appointment();
        appointment.setDate(dto.getDate());
        appointment.setTitle(dto.getTitle());
        appointment.setStatus(dto.getStatus());
        appointment.setType(dto.getType());
        appointment.setMedicalRecord(record);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        historyService.createHistory(record.getId(), HistoryType.APPOINTMENT_ADDED);

        return savedAppointment;
    }

    @Override
    public Appointment updateAppointment(Long appointmentId, Long medicalRecordId, AppointmentDto dto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        MedicalRecord record = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        appointment.setDate(dto.getDate());
        appointment.setTitle(dto.getTitle());
        appointment.setStatus(dto.getStatus());
        appointment.setType(dto.getType());
        appointment.setMedicalRecord(record);

        Appointment updatedAppointment = appointmentRepository.save(appointment);

        historyService.createHistory(record.getId(), HistoryType.APPOINTMENT_UPDATED);

        return updatedAppointment;
    }

    @Override
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        MedicalRecord record = appointment.getMedicalRecord();

        historyService.createHistory(record.getId(), HistoryType.APPOINTMENT_DELETED);

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
