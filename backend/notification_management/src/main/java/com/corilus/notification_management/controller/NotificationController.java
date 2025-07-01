package com.corilus.notification_management.controller;

import com.corilus.notification_management.dto.NotificationDto;
import com.corilus.notification_management.entity.Notification;
import com.corilus.notification_management.service.MailService;
import com.corilus.notification_management.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final MailService mailService;

    // Injection via constructeur
    @Autowired
    public NotificationController(NotificationService notificationService, MailService mailService) {
        this.notificationService = notificationService;
        this.mailService = mailService;
    }

    @GetMapping
    public List<Notification> getNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/receiver/{receiverId}")
    public List<Notification> getNotificationsByReceiverId(@PathVariable Long receiverId) {
        return notificationService.getNotificationsByReceiverId(receiverId);
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

    @PostMapping("/send-mail")
    public ResponseEntity<String> sendMail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String text) {
        mailService.sendEmail(to, subject, text);
        return ResponseEntity.ok("Email envoyé avec succès !");
    }
}