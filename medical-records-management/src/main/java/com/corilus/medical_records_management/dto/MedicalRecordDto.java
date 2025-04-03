package com.corilus.medical_records_management.dto;

import lombok.Data;

import java.util.Date;

@Data
public class MedicalRecordDto {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private Date creationDate;

}
