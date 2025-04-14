package com.corilus.medical_records_management.dto;

import lombok.Data;

import java.util.Date;

@Data
public class MedicalRecordDto {
    private Long patientId;
    private Date creationDate;

}
