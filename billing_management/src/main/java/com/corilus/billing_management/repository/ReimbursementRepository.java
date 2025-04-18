package com.corilus.billing_management.repository;

import com.corilus.billing_management.entity.Reimbursement;
import com.corilus.billing_management.enums.ReimbursementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReimbursementRepository extends JpaRepository<Reimbursement, Long> {

    List<Reimbursement> findByStatus(ReimbursementStatus status);

    List<Reimbursement> findByInvoiceId(Long invoiceId);

    List<Reimbursement> findByInsuredId(Long insuredId);
}