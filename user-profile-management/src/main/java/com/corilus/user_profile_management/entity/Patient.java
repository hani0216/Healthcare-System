package com.corilus.user_profile_management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_info_id", nullable = false)
    private UserInfo patientInfo;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date birthDate;

    @Column(nullable = false, unique = true)
    private Integer cin;

    @Column(nullable = false, unique = true)
    private Integer insuranceNumber;

    private String insurance;
}
