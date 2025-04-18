package com.corilus.billing_management.dto;

import com.corilus.billing_management.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {

    private Long id;
    private Timestamp invoiceDate;
    private Double amount;
    private String description;
    private Status status;
    private Long generatedBy;
    private Long medicalRecordId;
}