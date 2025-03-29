package com.corilus.medical_records_management.repository;

import com.corilus.medical_records_management.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByMedicalRecord_PatientId(Long patientId);
}
