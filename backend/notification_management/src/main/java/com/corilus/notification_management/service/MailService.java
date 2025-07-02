package com.corilus.notification_management.service;

public interface MailService {
    void sendEmail(String to, String subject, String htmlContent);
    void sendHtmlEmail(String to, String subject, String htmlContent);
    void sendAuthorizationEmail(String to, String senderName, Long doctorId, Long medicalRecordId);


}