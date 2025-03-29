package com.corilus.medical_records_management.entity;

import jakarta.persistence.*;
import lombok.Data;

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

    private Long uploadedById;

    @OneToOne
    private Note note;
}
