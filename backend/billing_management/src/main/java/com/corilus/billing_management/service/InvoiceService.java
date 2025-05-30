package com.corilus.billing_management.service;

import com.corilus.billing_management.dto.InvoiceDTO;
import com.corilus.billing_management.enums.Status;

import java.util.List;

public interface InvoiceService {

    InvoiceDTO createInvoice(InvoiceDTO invoiceDTO);

    InvoiceDTO getInvoiceById(Long id);

    List<InvoiceDTO> getAllInvoices();

    InvoiceDTO updateInvoice(Long id, InvoiceDTO invoiceDTO);

    void deleteInvoice(Long id);

    List<InvoiceDTO> getInvoicesByStatus(Status status);

    List<InvoiceDTO> getInvoicesByMedicalRecordId(Long medicalRecordId);

    List<InvoiceDTO> getInvoicesByGeneratedBy(Long userId);


}