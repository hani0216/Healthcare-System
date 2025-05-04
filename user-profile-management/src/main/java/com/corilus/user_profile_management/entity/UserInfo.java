package com.corilus.user_profile_management.entity;
import com.corilus.user_profile_management.enums.ROLE;

import jakarta.persistence.*;
        import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_info")
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String name;

    @Column(unique = true, nullable = true)
    private String phone;

    @Column(nullable = true, unique = true)
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = true)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private ROLE role;
}
