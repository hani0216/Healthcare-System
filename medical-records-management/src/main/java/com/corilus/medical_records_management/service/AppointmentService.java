package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.AppointmentDto;
import com.corilus.medical_records_management.entity.Appointment;

import java.util.List;

public interface AppointmentService {

    void deleteAppointment(Long id);

    List<Appointment> getAppointmentsByUser(Long id);

    Appointment createAppointment(Long medicalRecordId, AppointmentDto dto);

    Appointment updateAppointment(Long appointmentId, Long medicalRecordId, AppointmentDto dto);


    Appointment getAppointmentById(Long id);
}
