package com.corilus.notification_management.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Échec de l'envoi du mail", e);
        }
    }

    // Méthode utilitaire pour envoyer des emails HTML
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        sendEmail(to, subject, htmlContent);
    }

    @Override
    public void sendAuthorizationEmail(String to, String senderName, Long doctorId, Long medicalRecordId) {
        try {
            // Étape 1 : Générer le token
            String tokenPayload = "doctorId=" + doctorId + "&medicalRecordId=" + medicalRecordId;
            String encodedToken = Base64.getUrlEncoder().encodeToString(tokenPayload.getBytes(StandardCharsets.UTF_8));

            // Étape 2 : Construire les URLs avec le token
            String acceptUrl = "http://localhost:3000/authorization-response?token=" + encodedToken + "&status=AUTHORIZED";
            String rejectUrl = "http://localhost:3000/authorization-response?token=" + encodedToken + "&status=REJECTED";

            // Étape 3 : Construire le contenu HTML
            String html = """
                <html>
                  <body>
                    <p>Bonjour,</p>
                    <p><b>%s</b> a demandé à accéder à votre dossier médical.</p>
                    <p>Souhaitez-vous autoriser cet accès ?</p>
                    <a href="%s" style="padding:10px 20px; background:#28a745; color:white; text-decoration:none; border-radius:5px;">✅ Accepter</a>
                    &nbsp;
                    <a href="%s" style="padding:10px 20px; background:#dc3545; color:white; text-decoration:none; border-radius:5px;">❌ Refuser</a>
                  </body>
                </html>
            """.formatted(senderName, acceptUrl, rejectUrl);

            // Étape 4 : Créer le mail HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

            helper.setTo(to);
            helper.setSubject("DEMANDE D’AUTORISATION D’ACCÈS AU DOSSIER MÉDICAL");
            helper.setText(html, true); // true = HTML

            // Étape 5 : Envoyer
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email", e);
        }
    }
}