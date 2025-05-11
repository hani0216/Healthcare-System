package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.entity.UserInfo;
import com.corilus.user_profile_management.repository.UserInfoRepository;
import com.corilus.user_profile_management.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserInfoServiceImpl implements UserInfoService {

    private final UserInfoRepository userInfoRepository;

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
}
