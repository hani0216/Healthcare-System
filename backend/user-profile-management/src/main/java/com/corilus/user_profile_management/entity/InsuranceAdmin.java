package com.corilus.user_profile_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "insurance_admin")
public class InsuranceAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_info_id", nullable = false)
    private UserInfo userInfo;

    @Column(nullable = true)
    private String insuranceCompany;

    @Column(nullable = true)
    private Long insuranceLicenseNumber;
}
