package com.corilus.user_profile_management.repository;

import com.corilus.user_profile_management.entity.InsuranceAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsuranceAdminRepository extends JpaRepository<InsuranceAdmin, Long> {
    Optional<InsuranceAdmin> findByUserInfoId(Long userInfoId);
    List<InsuranceAdmin> findByInsuranceCompany(String insuranceCompany);
}
