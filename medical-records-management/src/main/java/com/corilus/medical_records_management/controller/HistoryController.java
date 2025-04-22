package com.corilus.medical_records_management.controller;

import com.corilus.medical_records_management.entity.History;
import com.corilus.medical_records_management.enums.HistoryType;
import com.corilus.medical_records_management.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @PostMapping("/{medicalRecordId}")
    public ResponseEntity<History> createHistory(@PathVariable Long medicalRecordId,
                                                 @RequestParam("type") HistoryType historyType) {
        try {
            History createdHistory = historyService.createHistory(medicalRecordId, historyType);
            return ResponseEntity.ok(createdHistory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}