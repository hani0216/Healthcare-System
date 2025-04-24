package com.corilus.notification_management.repository;


import com.corilus.notification_management.entity.SharingMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SharingMessageRepository extends JpaRepository<SharingMessage, Long> {
}