package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.NoteDto;
import com.corilus.medical_records_management.entity.Note;

import java.util.List;

public interface NoteService {

    Note createNoteForMedicalRecord(Long recordId, NoteDto noteDto);

    List<Note> getNotesByMedicalRecord(Long id);

    Note createNoteForDocument(Long documentId, NoteDto noteDto);

    Note getNotesByDocument(Long documentId, NoteDto noteDto);

    Note updateNote(Long id, NoteDto noteDto);

    void deleteNote(Long id);

    Note getNoteById(Long id);
}
