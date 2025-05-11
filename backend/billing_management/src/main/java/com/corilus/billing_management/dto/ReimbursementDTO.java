package com.corilus.billing_management.dto;

import com.corilus.billing_management.enums.ReimbursementStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReimbursementDTO {

    private Long id;
    private ReimbursementStatus status;
    private Double amount;
    private Long invoiceId;
    private Long insuredId;
    private Long medicalRecordId;
}