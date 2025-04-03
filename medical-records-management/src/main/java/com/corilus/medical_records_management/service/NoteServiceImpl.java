package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.client.DoctorClient;
import com.corilus.medical_records_management.dto.DoctorDto;
import com.corilus.medical_records_management.dto.NoteDto;
import com.corilus.medical_records_management.entity.Note;
import com.corilus.medical_records_management.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    @Autowired
    private DoctorClient doctorClient;

    @Override
    public Note createNoteForMedicalRecord(Long recordId, Long doctorId, NoteDto noteDto) {
        validateDoctor(doctorId);

        Note note = new Note();
        note.setTitle(noteDto.getTitle());
        note.setDescription(noteDto.getDescription());
        note.setDate(new Timestamp(System.currentTimeMillis()));
        note.setAuthorId(doctorId);

        return noteRepository.save(note);
    }

    @Override
    public Note getNoteByMedicalRecord(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found for medical record with id: " + id));
    }

    @Override
    public Note createNoteForDocument(Long documentId, Long doctorId, NoteDto noteDto) {
        validateDoctor(doctorId);

        Note note = new Note();
        note.setTitle(noteDto.getTitle());
        note.setDescription(noteDto.getDescription());
        note.setDate(new Timestamp(System.currentTimeMillis()));
        note.setAuthorId(doctorId);

        return noteRepository.save(note);
    }

    @Override
    public Note getNotesByDocument(Long documentId, NoteDto noteDto) {
        return noteRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Note not found for document with id: " + documentId));
    }

    @Override
    public Note updateNote(Long id, NoteDto noteDto) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        note.setTitle(noteDto.getTitle());
        note.setDescription(noteDto.getDescription());
        note.setDate(new Timestamp(System.currentTimeMillis())); // Assume that you might want to update the timestamp when the note is updated

        return noteRepository.save(note);
    }

    @Override
    public void deleteNote(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        noteRepository.delete(note);
    }

    @Override
    public Note getNoteById(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
    }

    private void validateDoctor(Long doctorId) {
        DoctorDto doctor = doctorClient.getDoctorById(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Doctor not found with id: " + doctorId);
        }
    }
}
