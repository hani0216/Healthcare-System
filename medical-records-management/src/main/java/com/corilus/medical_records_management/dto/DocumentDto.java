package com.corilus.medical_records_management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentDto {

    @NotNull
    private byte[] content;

    @NotBlank
    private String name;

    @NotNull
    private Long uploadedById;
}
