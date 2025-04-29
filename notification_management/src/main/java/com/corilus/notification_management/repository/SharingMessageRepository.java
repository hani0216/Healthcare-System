package com.corilus.notification_management.repository;


import com.corilus.notification_management.entity.SharingMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SharingMessageRepository extends JpaRepository<SharingMessage, Long> {

    List<SharingMessage> findBySenderId(Long senderId);
    List<SharingMessage> findByReceiverId(Long receiverId);
}