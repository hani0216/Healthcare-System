package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.entity.History;
import com.corilus.medical_records_management.enums.HistoryType;

public interface HistoryService {

    History createHistory(Long medicalRecordId, HistoryType type);

    void deleteHistory(Long id);

    History getHistoryById(Long id);
}
