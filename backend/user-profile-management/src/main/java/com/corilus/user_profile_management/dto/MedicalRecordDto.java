package com.corilus.user_profile_management.dto;

import lombok.Data;

import java.util.Date;

@Data
public class MedicalRecordDto {
    private Long patientId;
    private Date creationDate;

}
