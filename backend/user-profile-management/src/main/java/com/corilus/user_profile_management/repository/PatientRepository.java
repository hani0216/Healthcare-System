package com.corilus.user_profile_management.repository;

import com.corilus.user_profile_management.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    @Query("SELECT p FROM Patient p WHERE p.patientInfo.name = :name")
    Optional<Patient> findByName(String name);

    Optional<Patient> findByPatientInfoId(Long patientInfoId);
}