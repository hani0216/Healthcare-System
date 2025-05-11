package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.client.DoctorClient;
import com.corilus.medical_records_management.dto.DoctorDto;
import com.corilus.medical_records_management.dto.NoteDto;
import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.entity.Note;
import com.corilus.medical_records_management.enums.HistoryType;
import com.corilus.medical_records_management.kafka.NoteProducer;
import com.corilus.medical_records_management.repository.DocumentRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.corilus.medical_records_management.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final HistoryService historyService;
    private final MedicalRecordService medicalRecordService;
    private final MedicalRecordRepository medicalRecordRepository;
    private final DocumentRepository documentRepository;
    @Autowired
    private DoctorClient doctorClient;
    @Autowired
    private NoteProducer noteProducer;

    @Override
    public Note createNoteForMedicalRecord(Long recordId, Long doctorId, NoteDto noteDto) {
        validateDoctor(doctorId);

        Note note = new Note();
        note.setTitle(noteDto.getTitle());
        note.setDescription(noteDto.getDescription());
        note.setDate(new Timestamp(System.currentTimeMillis()));
        note.setAuthorId(doctorId);

        Note savedNote = noteRepository.save(note);

        noteProducer.sendNoteCreatedMessage(savedNote.getId(), savedNote.getTitle(), savedNote.getDate().toString());

        return savedNote;
    }

    @Override
    public Note getNoteByMedicalRecord(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found for medical record with id: " + id));
    }

    @Override
    public Note createNoteForDocument(Long documentId, Long doctorId, NoteDto noteDto) {
        validateDoctor(doctorId);

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));

        Note note;

        if (document.getNote() != null) {
            note = document.getNote();
            note.setTitle(noteDto.getTitle());
            note.setDescription(noteDto.getDescription());
            note.setDate(new Timestamp(System.currentTimeMillis()));
            note.setAuthorId(doctorId);

            MedicalRecord medicalRecord = medicalRecordRepository.findByDocumentId(documentId).orElse(null);
            if (medicalRecord != null) {
                historyService.createHistory(medicalRecord.getId(), HistoryType.NOTE_CREATED);
            }
        } else {
            note = new Note();
            note.setTitle(noteDto.getTitle());
            note.setDescription(noteDto.getDescription());
            note.setDate(new Timestamp(System.currentTimeMillis()));
            note.setAuthorId(doctorId);

            note = noteRepository.save(note);

            document.setNote(note);
            documentRepository.save(document);

            MedicalRecord medicalRecord = medicalRecordRepository.findByDocumentId(documentId).orElse(null);
            if (medicalRecord != null) {
                historyService.createHistory(medicalRecord.getId(), HistoryType.NOTE_UPDATED);
            }
        }

        Note savedNote = noteRepository.save(note);

        noteProducer.sendNoteCreatedMessage(savedNote.getId(), savedNote.getTitle(), savedNote.getDate().toString());

        return savedNote;
    }

    @Override
    public Note getNotesByDocument(Long documentId, NoteDto noteDto) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));

        Note note = document.getNote();

        if (note == null) {
            throw new RuntimeException("Aucune note trouvée pour le document avec id: " + documentId);
        }

        return note;
    }

    @Override
    public Note updateNote(Long id, NoteDto noteDto) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        note.setTitle(noteDto.getTitle());
        note.setDescription(noteDto.getDescription());
        note.setDate(new Timestamp(System.currentTimeMillis()));
        Note updatedNote = noteRepository.save(note);

        MedicalRecord medicalRecord = medicalRecordRepository.findByNoteId(id).orElse(null);
        if (medicalRecord != null) {
            historyService.createHistory(medicalRecord.getId(), HistoryType.NOTE_UPDATED);
        }

        noteProducer.sendNoteUpdatedMessage(updatedNote.getId(), updatedNote.getTitle(), updatedNote.getDate().toString());

        return updatedNote;
    }

    @Override
    public void deleteNoteFromDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));

        if (document.getNote() != null) {
            Note noteToDelete = document.getNote();
            document.setNote(null);
            documentRepository.save(document);

            MedicalRecord medicalRecord = medicalRecordRepository.findByDocumentId(documentId).orElse(null);
            if (medicalRecord != null) {
                historyService.createHistory(medicalRecord.getId(), HistoryType.NOTE_DELETED);
            }

            noteProducer.sendNoteDeletedMessage(noteToDelete.getId(), noteToDelete.getTitle(), new Timestamp(System.currentTimeMillis()).toString());

            noteRepository.delete(noteToDelete);
        } else {
            throw new RuntimeException("No note associated with document id: " + documentId);
        }
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
