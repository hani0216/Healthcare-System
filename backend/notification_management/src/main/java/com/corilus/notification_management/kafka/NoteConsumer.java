package com.corilus.notification_management.kafka;

import com.corilus.notification_management.dto.NotificationDto;
import com.corilus.notification_management.service.NotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import static com.corilus.notification_management.enums.Frequency.SINGLE;
import static com.corilus.notification_management.enums.NotificationType.Info;

@Service
public class NoteConsumer {

    private static final String TOPIC = "medical-note-topic";

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = TOPIC, groupId = "notification-group")
    public void listenForNoteEvents(String message) {
        try {
            JsonNode jsonNode = objectMapper.readTree(message);
            String eventType = jsonNode.get("eventType").asText();
            String title = jsonNode.get("title").asText();
            Long patientId = jsonNode.get("patientId").asLong();
            String eventTime = jsonNode.get("eventTime").asText();

            if ("CREATED".equals(eventType) || "UPDATED".equals(eventType) || "DELETED".equals(eventType)) {
                NotificationDto notificationDto = new NotificationDto();
                notificationDto.setTitle("NOTE " + eventType);
                notificationDto.setMessage("Note " + eventType + " titled: " + title);
                notificationDto.setReceiverId(patientId);
                notificationDto.setFrequency(SINGLE);
                notificationDto.setNotificationType(Info);
                notificationDto.setTimeToSend(new java.sql.Timestamp(System.currentTimeMillis()));
                notificationService.createNotification(notificationDto);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
