package com.corilus.notification_management.entity;



import jakarta.persistence.*;
import com.corilus.notification_management.enums.Frequency;
import com.corilus.notification_management.enums.NotificationType;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    private Boolean seen;

    private Timestamp timeToSend;

    private Long receiverId;

    @Enumerated(EnumType.STRING)
    private Frequency frequency;


}
