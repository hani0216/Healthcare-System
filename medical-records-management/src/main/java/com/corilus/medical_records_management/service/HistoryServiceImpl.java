package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.entity.History;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.enums.HistoryType;
import com.corilus.medical_records_management.repository.HistoryRepository;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import com.corilus.medical_records_management.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

    private final HistoryRepository historyRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Override
    public History createHistory(Long medicalRecordId, HistoryType type) {
        MedicalRecord record = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        History history = new History();
        history.setType(type);
        history.setDate(new Timestamp(System.currentTimeMillis()));

        History saved = historyRepository.save(history);

        record.getLogs().add(saved);
        medicalRecordRepository.save(record);

        return saved;
    }

    @Override
    public void deleteHistory(Long id) {
        historyRepository.deleteById(id);
    }

    @Override
    public History getHistoryById(Long id) {
        return historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("History not found"));
    }
}
