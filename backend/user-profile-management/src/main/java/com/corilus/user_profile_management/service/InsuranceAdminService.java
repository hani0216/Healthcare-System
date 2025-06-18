package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.dto.InsuranceAdminDto;
import com.corilus.user_profile_management.entity.InsuranceAdmin;
import java.util.List;

public interface InsuranceAdminService {
    InsuranceAdmin createInsuranceAdmin(InsuranceAdminDto dto);
    InsuranceAdmin updateInsuranceAdmin(Long id, InsuranceAdminDto dto);
    void deleteInsuranceAdmin(Long id);
    InsuranceAdmin getInsuranceById(Long id);
    List<InsuranceAdmin> getAllInsuranceAdmins();
    InsuranceAdmin getInsuranceAdminByUserInfoId(Long userInfoId);
    List<InsuranceAdmin> getInsuranceAdminsByCompany(String insuranceCompany) ;
}
