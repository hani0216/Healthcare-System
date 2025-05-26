package com.corilus.notification_management.service;

import com.corilus.notification_management.dto.NotificationDto;
import com.corilus.notification_management.entity.Notification;
import com.corilus.notification_management.enums.Frequency;
import com.corilus.notification_management.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.corilus.notification_management.enums.NotificationType.Info;

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
        notification.setNotificationType(notificationDto.getNotificationType());
        Timestamp timeToSend = calculateTimeToSend(notificationDto.getFrequency());
        notification.setTimeToSend(timeToSend);

        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsByReceiverId(Long receiverId) {
        return notificationRepository.findByReceiverId(receiverId);
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

    private Timestamp calculateTimeToSend(Frequency frequency) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sendTime;

        switch (frequency) {
            case Daily:
                sendTime = now.plus(1, ChronoUnit.DAYS);
                break;
            case Weekly:
                sendTime = now.plus(1, ChronoUnit.WEEKS);
                break;
            case Monthly:
                sendTime = now.plus(1, ChronoUnit.HOURS);
                break;
            case Single:
                sendTime = now;
                break;
            default:
                sendTime = now;
        }

        return Timestamp.valueOf(sendTime);
    }
}
