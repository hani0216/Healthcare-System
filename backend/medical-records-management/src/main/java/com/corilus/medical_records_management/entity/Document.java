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

    // Utiliser FetchType.LAZY pour éviter de charger le contenu automatiquement
    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    private byte[] content;

    private String name;
    
    // Ajouter des métadonnées utiles
    private String contentType;
    private Long fileSize;

    @JoinColumn(name = "medical_record_id")
    @JsonIgnore
    private Long medicalRecord;

    private Long uploadedById;

    @OneToOne(fetch = FetchType.LAZY)
    private Note note;
}