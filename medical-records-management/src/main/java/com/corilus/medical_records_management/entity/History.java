package com.corilus.medical_records_management.entity;

import com.corilus.medical_records_management.enums.HistoryType;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private HistoryType type;

    private Timestamp date;

    @ManyToOne
    private MedicalRecord medicalRecord;
}
