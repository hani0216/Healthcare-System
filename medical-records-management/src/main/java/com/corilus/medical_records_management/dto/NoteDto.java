package com.corilus.medical_records_management.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NoteDto {

    @NotBlank
    private String title;

    private String description;
}
