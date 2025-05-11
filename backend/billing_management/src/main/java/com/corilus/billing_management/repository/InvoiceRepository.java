package com.corilus.billing_management.repository;

import com.corilus.billing_management.entity.Invoice;
import com.corilus.billing_management.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findByStatus(Status status);

    List<Invoice> findByMedicalRecordId(Long medicalRecordId);

    List<Invoice> findByGeneratedBy(Long userId);
}