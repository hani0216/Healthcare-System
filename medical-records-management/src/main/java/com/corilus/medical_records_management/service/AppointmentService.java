package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.AppointmentDto;
import com.corilus.medical_records_management.entity.Appointment;

import java.util.List;

public interface AppointmentService {

    Appointment createAppointment(AppointmentDto appointmentDto);

    void deleteAppointment(Long id);

    List<Appointment> getAppointmentsByUser(Long id);

    Appointment updateAppointment(Long id, AppointmentDto appointmentDto);

    Appointment getAppointmentById(Long id);
}
