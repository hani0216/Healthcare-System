package com.corilus.billing_management.entity;


import com.corilus.billing_management.enums.ReimbursementStatus;
import lombok.*;
import jakarta.persistence.*;

@Entity
@Getter
@Setter
public class Reimbursement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ReimbursementStatus status;

    private Double amount;

    private Long invoiceId;

    private Long insuredId;

    private Long medicalRecordId;
}