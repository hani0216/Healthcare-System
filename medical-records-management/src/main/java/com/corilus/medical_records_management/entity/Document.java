package com.corilus.medical_records_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.corilus.medical_records_management.entity.MedicalRecord;

import java.util.Date;

@Entity
@Data
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date creationDate;

    @Lob
    private byte[] content;

    private String name;


    @ManyToOne
    @JoinColumn(name = "medical_record_id")
    private MedicalRecord medicalRecord;


    private Long uploadedById;

    @OneToOne
    private Note note;
}
