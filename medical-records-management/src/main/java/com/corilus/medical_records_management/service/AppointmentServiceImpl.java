package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.AppointmentDto;
import com.corilus.medical_records_management.entity.Appointment;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.enums.Status;
import com.corilus.medical_records_management.enums.Type;
import com.corilus.medical_records_management.repository.AppointmentRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.corilus.medical_records_management.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Override
    public Appointment createAppointment(AppointmentDto dto) {
        Appointment appointment = new Appointment();
        appointment.setDate(dto.getDate());
        appointment.setTitle(dto.getTitle());
        appointment.setStatus(dto.getStatus());
        appointment.setType(dto.getType());

        // You might associate it with a medical record here if needed
        return appointmentRepository.save(appointment);
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public List<Appointment> getAppointmentsByUser(Long patientId) {
        return appointmentRepository.findByMedicalRecord_PatientId(patientId);
    }

    @Override
    public Appointment updateAppointment(Long id, AppointmentDto dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setDate(dto.getDate());
        appointment.setTitle(dto.getTitle());
        appointment.setStatus(dto.getStatus());
        appointment.setType(dto.getType());
        return appointmentRepository.save(appointment);
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }
}
