package com.corilus.notification_management.dto;


import com.corilus.notification_management.entity.Notification;
import com.corilus.notification_management.enums.Frequency;
import com.corilus.notification_management.enums.NotificationType;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class NotificationDto {

    private String title;
    private String message;
    private Long receiverId;
    private Frequency frequency;
    private Timestamp timeToSend;
    private NotificationType notificationType;

}
