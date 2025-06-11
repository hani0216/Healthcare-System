package com.corilus.medical_records_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JoinColumn(name = "medical_record_id")
    @JsonIgnore
    private Long medicalRecord;

    private Long uploadedById;

    @OneToOne
    private Note note;
}