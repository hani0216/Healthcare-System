package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.NoteDto;
import com.corilus.medical_records_management.entity.Note;

import java.util.List;

public interface NoteService {

    Note createNoteForMedicalRecord(Long recordId, Long doctorId, NoteDto noteDto);

    Note getNoteByMedicalRecord(Long id);

    Note createNoteForDocument(Long documentId, Long doctorId, NoteDto noteDto);

    Note getNotesByDocument(Long documentId, NoteDto noteDto);

    Note updateNote(Long id, NoteDto noteDto);

    void deleteNoteFromDocument(Long documentId);

    Note getNoteById(Long id);
}
