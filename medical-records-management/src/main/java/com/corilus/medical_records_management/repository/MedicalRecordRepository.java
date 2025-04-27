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



    Optional<MedicalRecord> findById(Long medicalRecordId);




    @Query("SELECT mr FROM MedicalRecord mr JOIN mr.documents doc WHERE doc.id = :documentId")
    MedicalRecord findMedicalRecordByDocumentId(@Param("documentId") Long documentId);


    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.note.id = :noteId")
    Optional<MedicalRecord> findByNoteId(Long noteId);


    @Query("SELECT mr FROM MedicalRecord mr JOIN mr.documents doc WHERE doc.id = :documentId")
    Optional<MedicalRecord> findByDocumentId(@Param("documentId") Long documentId);





}
