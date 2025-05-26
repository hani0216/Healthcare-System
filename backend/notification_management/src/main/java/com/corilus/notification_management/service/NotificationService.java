package com.corilus.notification_management.service;


import com.corilus.notification_management.dto.NotificationDto;
import com.corilus.notification_management.entity.Notification;
import java.util.List;

public interface NotificationService {

    List<Notification> getAllNotifications();

    Notification createNotification(NotificationDto notification);

    Notification updateNotification(Long id, Notification notificationDetails);

    void deleteNotification(Long id);

    List<Notification> getNotificationsByReceiverId(Long receiverId);


}

