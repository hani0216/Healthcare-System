package com.corilus.medical_records_management.dto;

import com.corilus.medical_records_management.enums.Type;
import com.corilus.medical_records_management.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class AppointmentDto {

    @NotNull
    private Timestamp date;

    @NotBlank
    private String title;

    @NotNull
    private Status status;

    @NotNull
    private Type type;
}
