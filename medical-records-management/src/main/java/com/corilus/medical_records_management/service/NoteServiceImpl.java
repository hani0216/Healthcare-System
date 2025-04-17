package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.client.DoctorClient;
import com.corilus.medical_records_management.dto.DoctorDto;
import com.corilus.medical_records_management.dto.NoteDto;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.entity.Note;
import com.corilus.medical_records_management.enums.HistoryType;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.corilus.medical_records_management.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.corilus.medical_records_management.service.HistoryService;
import com.corilus.medical_records_management.service.MedicalRecordService;
import com.corilus.medical_records_management.entity.Document;
import com.corilus.medical_records_management.repository.DocumentRepository;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    @Autowired
    private DoctorClient doctorClient;
    @Autowired
    private final HistoryService historyService;
    @Autowired
    private final MedicalRecordService medicalRecordService;
    @Autowired
    private final MedicalRecordRepository medicalRecordRepository;
    @Autowired
    private final DocumentRepository documentRepository ;

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

        return noteRepository.save(note);
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

        MedicalRecord medicalRecord = medicalRecordRepository.findByNoteId(id)
                .orElse(null);

        if (medicalRecord != null) {
            historyService.createHistory(medicalRecord.getId(), HistoryType.NOTE_UPDATED);
        }

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