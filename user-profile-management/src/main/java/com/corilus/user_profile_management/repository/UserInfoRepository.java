package com.corilus.user_profile_management.repository;

import com.corilus.user_profile_management.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    Optional<UserInfo> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
