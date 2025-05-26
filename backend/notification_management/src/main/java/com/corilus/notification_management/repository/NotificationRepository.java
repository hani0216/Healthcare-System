package com.corilus.notification_management.repository;

import com.corilus.notification_management.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByReceiverId(Long receiverId);

}