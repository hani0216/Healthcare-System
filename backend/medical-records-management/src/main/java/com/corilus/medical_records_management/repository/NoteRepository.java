package com.corilus.medical_records_management.repository;

import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    //Optional<MedicalRecord> findById(Long medicalRecordId);
}
