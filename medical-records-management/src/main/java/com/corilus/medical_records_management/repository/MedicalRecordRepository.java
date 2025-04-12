package com.corilus.medical_records_management.repository;

import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.entity.MedicalRecord;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import com.corilus.medical_records_management.entity.Document;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    Optional<MedicalRecord> findByPatientId(Long patientId);

    Optional<MedicalRecord> findByDocumentsContaining(Document document);


    @Query("SELECT mr FROM MedicalRecord mr JOIN mr.documents doc WHERE doc.id = :documentId")
    MedicalRecord findMedicalRecordByDocumentId(@Param("documentId") Long documentId);



}
