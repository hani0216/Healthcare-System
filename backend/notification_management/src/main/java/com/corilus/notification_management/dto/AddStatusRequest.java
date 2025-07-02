package com.corilus.notification_management.dto;

import com.corilus.notification_management.enums.AuthorizationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  // génère getters, setters, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
public class AddStatusRequest {
    private int doctorId;
    private int medicalRecordId;
    private AuthorizationStatus status;
}
