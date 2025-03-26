package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.dto.InsuranceAdminDto;
import com.corilus.user_profile_management.entity.InsuranceAdmin;
import com.corilus.user_profile_management.entity.UserInfo;
import com.corilus.user_profile_management.enums.ROLE;
import com.corilus.user_profile_management.repository.InsuranceAdminRepository;
import com.corilus.user_profile_management.repository.UserInfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InsuranceAdminServiceImpl implements InsuranceAdminService {

    private final InsuranceAdminRepository insuranceAdminRepository;
    private final UserInfoRepository userInfoRepository;

    public InsuranceAdminServiceImpl(InsuranceAdminRepository insuranceAdminRepository,
                                     UserInfoRepository userInfoRepository) {
        this.insuranceAdminRepository = insuranceAdminRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    @Transactional
    public InsuranceAdmin createInsuranceAdmin(InsuranceAdminDto dto) {
        UserInfo userInfo = new UserInfo();
        userInfo.setName(dto.getName());
        userInfo.setPhone(dto.getPhone());
        userInfo.setEmail(dto.getEmail());
        userInfo.setPassword(dto.getPassword());
        userInfo.setAddress(dto.getAddress());
        userInfo.setRole(ROLE.INSURANCE_ADMIN);


        userInfo = userInfoRepository.save(userInfo);

        InsuranceAdmin admin = new InsuranceAdmin();
        admin.setUserInfo(userInfo);
        admin.setInsuranceCompany(dto.getInsuranceCompany());
        admin.setInsuranceLicenseNumber(dto.getInsuranceLicenseNumber());

        return insuranceAdminRepository.save(admin);
    }

    @Override
    @Transactional
    public InsuranceAdmin updateInsuranceAdmin(Long id, InsuranceAdminDto dto) {
        Optional<InsuranceAdmin> existing = insuranceAdminRepository.findById(id);
        if (existing.isPresent()) {
            InsuranceAdmin admin = existing.get();
            UserInfo userInfo = admin.getUserInfo();

            userInfo.setName(dto.getName());
            userInfo.setPhone(dto.getPhone());
            userInfo.setEmail(dto.getEmail());
            userInfo.setPassword(dto.getPassword());
            userInfo.setAddress(dto.getAddress());

            userInfoRepository.save(userInfo);

            admin.setInsuranceCompany(dto.getInsuranceCompany());
            admin.setInsuranceLicenseNumber(dto.getInsuranceLicenseNumber());

            return insuranceAdminRepository.save(admin);
        } else {
            throw new RuntimeException("Insurance admin with ID " + id + " not found.");
        }
    }

    @Override
    public void deleteInsuranceAdmin(Long id) {
        if (insuranceAdminRepository.existsById(id)) {
            insuranceAdminRepository.deleteById(id);
        } else {
            throw new RuntimeException("Insurance admin with ID " + id + " does not exist.");
        }
    }

    @Override
    public List<InsuranceAdmin> getAllInsuranceAdmins(){
        return insuranceAdminRepository.findAll() ;
    }

    @Override
    public InsuranceAdmin getInsuranceById(Long id) {
        return insuranceAdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insurance admin with ID " + id + " not found."));
    }
}
