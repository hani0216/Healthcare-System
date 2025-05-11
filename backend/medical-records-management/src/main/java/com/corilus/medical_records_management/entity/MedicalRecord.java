package com.corilus.medical_records_management.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<History> logs;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private Note note;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;

    @Override
    public String toString() {
        return "MedicalRecord{id=" + id + ", patientId=" + patientId + "}";
    }

}
