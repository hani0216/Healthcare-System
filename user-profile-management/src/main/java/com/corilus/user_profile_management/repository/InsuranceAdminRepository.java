package com.corilus.user_profile_management.repository;

import com.corilus.user_profile_management.entity.InsuranceAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsuranceAdminRepository extends JpaRepository<InsuranceAdmin, Long> {
}
