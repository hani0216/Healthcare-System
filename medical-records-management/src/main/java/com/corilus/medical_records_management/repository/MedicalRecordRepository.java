package com.corilus.medical_records_management.repository;

import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    Optional<MedicalRecord> findByPatientId(Long patientId);

    Optional<MedicalRecord> findByPatientName(String name);

    Optional<MedicalRecord> findByNoteContaining(Note note);

    Optional<MedicalRecord> findByDocumentsContaining(Document document);


}
