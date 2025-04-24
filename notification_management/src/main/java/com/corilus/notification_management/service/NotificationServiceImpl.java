package com.corilus.notification_management.service;


import com.corilus.notification_management.dto.NotificationDto;
import com.corilus.notification_management.entity.Notification;
import com.corilus.notification_management.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public Notification createNotification(NotificationDto notificationDto) {
        Notification notification = new Notification();
        notification.setTitle(notificationDto.getTitle());
        notification.setMessage(notificationDto.getMessage());
        notification.setReceiverId(notificationDto.getReceiverId());
        notification.setFrequency(notificationDto.getFrequency());
        return notificationRepository.save(notification);
    }


    @Override
    public Notification updateNotification(Long id, Notification notificationDetails) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setTitle(notificationDetails.getTitle());
        notification.setMessage(notificationDetails.getMessage());
        notification.setNotificationType(notificationDetails.getNotificationType());
        notification.setSeen(notificationDetails.getSeen());
        notification.setTimeToSend(notificationDetails.getTimeToSend());
        notification.setReceiverId(notificationDetails.getReceiverId());
        notification.setFrequency(notificationDetails.getFrequency());
        return notificationRepository.save(notification);
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}