package com.corilus.medical_records_management.repository;

import com.corilus.medical_records_management.entity.Authorizations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorizationsRepository extends JpaRepository<Authorizations, Integer> {
    Optional<Authorizations> findByDoctorIdAndMedicalRecordId(int doctorId, int medicalRecordId);
}