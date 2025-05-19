package com.corilus.user_profile_management.controller;

import com.corilus.user_profile_management.entity.UserInfo;
import com.corilus.user_profile_management.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserInfoController {

    private final UserInfoService userInfoService;

    @GetMapping("/email/{email}")
    public ResponseEntity<UserInfo> getUserByEmail(@PathVariable String email) {
        Optional<UserInfo> user = userInfoService.findByEmail(email);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserInfo> createUser(@RequestBody UserInfo userInfo) {
        UserInfo createdUser = userInfoService.save(userInfo);
        return ResponseEntity.ok(createdUser);
    }

    @GetMapping("/userId/{email}")
    public ResponseEntity<Long> getUserIdByEmail(@PathVariable String email) {
        Optional<UserInfo> user = userInfoService.findByEmail(email);
        return user.map(userInfo -> ResponseEntity.ok(userInfo.getId())).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/specific-id/{email}")
    public ResponseEntity<Long> getSpecificUserIdByEmail(@PathVariable String email) {
        try {
            Long specificId = userInfoService.getSpecificUserIdByEmail(email);
            return ResponseEntity.ok(specificId);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}




