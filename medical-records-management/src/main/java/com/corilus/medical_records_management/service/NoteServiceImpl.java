package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.dto.NoteDto;
import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.entity.Note;
import com.corilus.medical_records_management.repository.DocumentRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.corilus.medical_records_management.repository.NoteRepository;
import com.corilus.medical_records_management.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final DocumentRepository documentRepository;

    @Override
    public Note createNoteForMedicalRecord(Long recordId, NoteDto noteDto) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        Note note = new Note();
        note.setTitle(noteDto.getTitle());
        note.setDescription(noteDto.getDescription());
        note.setDate(new Timestamp(System.currentTimeMillis()));
        note.setAuthorId(noteDto.getAuthorId());

        Note savedNote = noteRepository.save(note);

        medicalRecord.getNotes().add(savedNote);
        medicalRecordRepository.save(medicalRecord);

        return savedNote;
    }

    @Override
    public List<Note> getNotesByMedicalRecord(Long id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
        return record.getNotes();
    }

    @Override
    public Note createNoteForDocument(Long documentId, NoteDto noteDto) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        Note note = new Note();
        note.setTitle(noteDto.getTitle());
        note.setDescription(noteDto.getDescription());
        note.setDate(new Timestamp(System.currentTimeMillis()));
        note.setAuthorId(noteDto.getAuthorId());

        Note savedNote = noteRepository.save(note);

        document.setNote(savedNote);
        documentRepository.save(document);

        return savedNote;
    }

    @Override
    public Note getNotesByDocument(Long documentId, NoteDto noteDto) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return document.getNote();
    }

    @Override
    public Note updateNote(Long id, NoteDto noteDto) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        note.setTitle(noteDto.getTitle());
        note.setDescription(noteDto.getDescription());
        return noteRepository.save(note);
    }

    @Override
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    @Override
    public Note getNoteById(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
    }
}
