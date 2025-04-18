package com.corilus.billing_management.service;

import com.corilus.billing_management.dto.ReimbursementDTO;
import com.corilus.billing_management.enums.ReimbursementStatus;

import java.util.List;

public interface ReimbursementService {

    ReimbursementDTO createReimbursement(ReimbursementDTO reimbursementDTO);

    ReimbursementDTO getReimbursementById(Long id);

    List<ReimbursementDTO> getAllReimbursements();

    ReimbursementDTO updateReimbursement(Long id, ReimbursementDTO reimbursementDTO);

    void deleteReimbursement(Long id);

    List<ReimbursementDTO> getReimbursementsByStatus(ReimbursementStatus status);

    List<ReimbursementDTO> getReimbursementsByInvoiceId(Long invoiceId);

    List<ReimbursementDTO> getReimbursementsByInsuredId(Long insuredId);
}