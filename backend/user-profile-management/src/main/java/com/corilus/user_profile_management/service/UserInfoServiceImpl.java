package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.entity.UserInfo;
import com.corilus.user_profile_management.enums.ROLE;
import com.corilus.user_profile_management.repository.UserInfoRepository;
import com.corilus.user_profile_management.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserInfoServiceImpl implements UserInfoService {

    private final UserInfoRepository userInfoRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final InsuranceAdminService insuranceAdminService;

    @Override
    public Optional<UserInfo> findByEmail(String email) {
        return userInfoRepository.findByEmail(email);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userInfoRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return userInfoRepository.existsByPhone(phone);
    }

    @Override
    public UserInfo save(UserInfo userInfo) {
        return userInfoRepository.save(userInfo);
    }

    @Override
    public Long getSpecificUserIdByEmail(String email) {
        UserInfo userInfo = userInfoRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return switch (userInfo.getRole()) {
            case DOCTOR -> doctorService.getDoctorByUserInfoId(userInfo.getId()).getId();
            case PATIENT -> patientService.getPatientByUserInfoId(userInfo.getId()).getId();
            case INSURANCE_ADMIN -> insuranceAdminService.getInsuranceAdminByUserInfoId(userInfo.getId()).getId();
            default -> throw new RuntimeException("Invalid role for user with email: " + email);
        };
    }
}
