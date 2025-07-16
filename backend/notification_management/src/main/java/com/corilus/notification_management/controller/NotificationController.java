package com.corilus.notification_management.controller;

import com.corilus.notification_management.client.AuthorizationClient;
import com.corilus.notification_management.dto.AddStatusRequest;
import com.corilus.notification_management.dto.AuthorizationRequestDto;
import com.corilus.notification_management.dto.NotificationDto;
import com.corilus.notification_management.entity.Notification;
import com.corilus.notification_management.enums.AuthorizationStatus;
import com.corilus.notification_management.service.MailService;
import com.corilus.notification_management.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.corilus.notification_management.dto.ResponseDto;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final MailService mailService;
    private final AuthorizationClient authorizationClient;

    @Autowired
    public NotificationController(NotificationService notificationService,
                                  MailService mailService,
                                  AuthorizationClient authorizationClient) {
        this.notificationService = notificationService;
        this.mailService = mailService;
        this.authorizationClient = authorizationClient;
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

    @PostMapping("/send-authorization-json")
    public ResponseEntity<String> sendAuthorizationWithJson(@RequestBody AuthorizationRequestDto dto) {
        mailService.sendAuthorizationEmail(
                dto.getSendTo(),
                dto.getSenderName(),
                dto.getDoctorId(),
                dto.getMedicalRecordId()
        );
        return ResponseEntity.ok("Email envoyé à " + dto.getSendTo());
    }
    
    @GetMapping("/authorization/response")
    public ResponseEntity<String> handleResponse(
            @RequestParam String token,
            @RequestParam String status) {

        String html = """
        <html>
          <head><title>Confirmation</title></head>
          <body style='font-family:sans-serif; text-align:center; margin-top:50px;'>
            <h2>Veuillez confirmer votre choix :</h2>
            <button onclick="sendResponse('AUTHORIZED')" style='padding:10px 20px; background:#28a745; color:white;'>✅ Accepter</button>
            &nbsp;
            <button onclick="sendResponse('REJECTED')" style='padding:10px 20px; background:#dc3545; color:white;'>❌ Refuser</button>
            <script>
              function sendResponse(userStatus) {
                console.log('Envoi de la réponse:', userStatus, 'Token:', '%s');

                fetch('http://localhost:8088/api/notifications/authorization/save-response', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                  body: JSON.stringify({ token: '%s', status: userStatus })
                })
                .then(response => {
                  console.log('Réponse reçue:', response.status);
                  return response.text();
                })
                .then(data => {
                  console.log('Données reçues:', data);
                  document.body.innerHTML = '<h2 style="color:green;">✅ Réponse envoyée avec succès</h2><p>' + data + '</p>';
                })
                .catch(error => {
                  console.error('Erreur:', error);
                  document.body.innerHTML = '<h2 style="color:red;">❌ Erreur</h2><p>' + error + '</p>';
                });
              }
            </script>
          </body>
        </html>
        """.formatted(token, token);

        return ResponseEntity.ok()
                .header("Content-Type", "text/html; charset=UTF-8")
                .body(html);
    }

    @PostMapping("/authorization/save-response")
    public ResponseEntity<String> saveResponse(@RequestBody ResponseDto responseDto) {
        System.out.println("=== DÉBUT saveResponse ===");
        System.out.println("Token reçu: " + responseDto.getToken());
        System.out.println("Status reçu: " + responseDto.getStatus());

        try {
            String decoded = new String(Base64.getUrlDecoder().decode(responseDto.getToken()), StandardCharsets.UTF_8);
            System.out.println("Token décodé: " + decoded);

            Map<String, String> params = parseQueryString(decoded);
            System.out.println("Paramètres parsés: " + params);

            int doctorId = Integer.parseInt(params.get("doctorId"));
            int medicalRecordId = Integer.parseInt(params.get("medicalRecordId"));

            System.out.println("DoctorId: " + doctorId + ", MedicalRecordId: " + medicalRecordId);

            AuthorizationStatus statusEnum = AuthorizationStatus.valueOf(responseDto.getStatus());
            System.out.println("Status enum: " + statusEnum);

            AddStatusRequest addStatusRequest = new AddStatusRequest(doctorId, medicalRecordId, statusEnum);
            System.out.println("Envoi vers authorization client...");

            ResponseEntity<String> response = authorizationClient.addStatus(addStatusRequest);
            System.out.println("Réponse du client: " + response.getStatusCode());

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("=== SUCCÈS ===");
                return ResponseEntity.ok("Réponse enregistrée avec succès : " + responseDto.getStatus());
            } else {
                System.out.println("=== ÉCHEC - Status non 2xx ===");
                return ResponseEntity.status(response.getStatusCode()).body("Erreur lors de l'envoi de la réponse.");
            }

        } catch (Exception e) {
            System.out.println("=== ERREUR ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    }

    private Map<String, String> parseQueryString(String query) {
        Map<String, String> map = new HashMap<>();
        for (String part : query.split("&")) {
            String[] keyValue = part.split("=");
            if (keyValue.length == 2) {
                map.put(keyValue[0], keyValue[1]);
            }
        }
        return map;
    }

    public static class ResponseDto {
        private String token;
        private String status;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}