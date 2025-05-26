package com.corilus.notification_management.controller;


import com.corilus.notification_management.dto.NotificationDto;
import com.corilus.notification_management.entity.Notification;
import com.corilus.notification_management.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/notifications/receiver/{receiverId}")
    public List<Notification> getNotificationsByReceiverId(@PathVariable Long receiverId) {
        return notificationService.getNotificationsByReceiverId(receiverId);
    }

    @GetMapping
    public List<Notification> getNotifications() {
        return notificationService.getAllNotifications();
    }

    @PostMapping
    public Notification createNotification(@RequestBody NotificationDto notificationDto) {
        return notificationService.createNotification(notificationDto);
    }



    @PutMapping("/{id}")
    public Notification updateNotification(@PathVariable Long id, @RequestBody Notification notification) {
        return notificationService.updateNotification(id, notification);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}
