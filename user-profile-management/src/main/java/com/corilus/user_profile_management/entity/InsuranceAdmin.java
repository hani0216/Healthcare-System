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
    private UserInfo insuranceInfo;

    @Column(nullable = false, unique = true)
    private Long insuranceLicenseNumber;
}
