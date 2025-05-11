package com.corilus.billing_management.entity;

import com.corilus.billing_management.enums.Status;
import jakarta.persistence.*;
import lombok.*;



import java.sql.Timestamp;

@Entity
@Getter
@Setter
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Timestamp invoiceDate;

    private Double amount;

    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Long generatedBy;

    private Long medicalRecordId;
}
