package com.corilus.notification_management.repository;

import com.corilus.notification_management.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}