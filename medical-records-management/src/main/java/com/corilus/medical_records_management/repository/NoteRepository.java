package com.corilus.medical_records_management.repository;

import com.corilus.medical_records_management.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
}
