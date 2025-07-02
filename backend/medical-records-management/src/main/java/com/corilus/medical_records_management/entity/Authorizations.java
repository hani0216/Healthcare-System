package com.corilus.medical_records_management.entity;
import com.corilus.medical_records_management.enums.AuthorizationStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Entity
@Table(name = "authorizations", uniqueConstraints = @UniqueConstraint(columnNames = {"doctorId", "medicalRecordId"}))
@Getter
@Setter
public class Authorizations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int doctorId;

    @Column(nullable = true)
    private int medicalRecordId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private AuthorizationStatus status;
}