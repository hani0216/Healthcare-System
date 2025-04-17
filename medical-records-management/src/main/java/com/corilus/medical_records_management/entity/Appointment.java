package com.corilus.medical_records_management.entity;

import com.corilus.medical_records_management.enums.Status;
import com.corilus.medical_records_management.enums.Type;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Timestamp date;

    private String title;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Type type;

    @ManyToOne
    @JsonIgnore
    private MedicalRecord medicalRecord;
}
