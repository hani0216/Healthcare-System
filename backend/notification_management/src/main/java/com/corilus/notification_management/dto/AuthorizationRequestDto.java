package com.corilus.notification_management.dto;

import lombok.Data;

@Data
public class AuthorizationRequestDto {
    private Long doctorId;
    private Long medicalRecordId;
    private String sendTo;
    private String senderName;
}
