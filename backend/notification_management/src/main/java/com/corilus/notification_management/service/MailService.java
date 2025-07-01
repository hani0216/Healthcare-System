package com.corilus.notification_management.service;

public interface MailService {
    void sendEmail(String to, String subject, String text);
}