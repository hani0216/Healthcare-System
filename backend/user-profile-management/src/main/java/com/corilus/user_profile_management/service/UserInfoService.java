package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.entity.UserInfo;
import java.util.Optional;

public interface UserInfoService {
    Optional<UserInfo> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    UserInfo save(UserInfo userInfo);
    Long getSpecificUserIdByEmail(String email);
}
