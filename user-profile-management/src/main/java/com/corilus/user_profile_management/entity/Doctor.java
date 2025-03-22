package com.corilus.user_profile_management.entity;
import com.corilus.user_profile_management.enums.SPECIALITY;
import jakarta.persistence.*;
        import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_info_id", nullable = false)
    private UserInfo doctorInfo;

    @Column(nullable = false, unique = true)
    private Long medicalLicenseNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SPECIALITY speciality;
}
