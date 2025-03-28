package com.corilus.medical_records_management.repository;

import com.corilus.medical_records_management.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    Optional<Document> findFirstByMedicalRecord_PatientId(Long patientId);

    List<Document> findByMedicalRecord_Id(Long medicalRecordId);
}
