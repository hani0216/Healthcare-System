package com.corilus.medical_records_management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "medical_record_id")
    private List<History> logs;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;
}
