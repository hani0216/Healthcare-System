package com.corilus.billing_management.service;

import com.corilus.billing_management.dto.InvoiceDTO;
import com.corilus.billing_management.entity.Invoice;
import com.corilus.billing_management.enums.Status;
import com.corilus.billing_management.exception.ResourceNotFoundException;
import com.corilus.billing_management.repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        Invoice invoice = mapToEntity(invoiceDTO);
        invoiceDTO.setInvoiceDate(new java.sql.Timestamp(System.currentTimeMillis()));
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(savedInvoice);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
        return mapToDTO(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getAllInvoices() {
        List<Invoice> invoices = invoiceRepository.findAll();
        return invoices.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceDTO updateInvoice(Long id, InvoiceDTO invoiceDTO) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        invoice.setInvoiceDate(invoiceDTO.getInvoiceDate());
        invoice.setAmount(invoiceDTO.getAmount());
        invoice.setDescription(invoiceDTO.getDescription());
        invoice.setStatus(invoiceDTO.getStatus());
        invoice.setGeneratedBy(invoiceDTO.getGeneratedBy());
        invoice.setMedicalRecordId(invoiceDTO.getMedicalRecordId());

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(updatedInvoice);
    }

    @Override
    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
        invoiceRepository.delete(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getInvoicesByStatus(Status status) {
        List<Invoice> invoices = invoiceRepository.findByStatus(status);
        return invoices.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getInvoicesByMedicalRecordId(Long medicalRecordId) {
        List<Invoice> invoices = invoiceRepository.findByMedicalRecordId(medicalRecordId);
        return invoices.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getInvoicesByGeneratedBy(Long userId) {
        List<Invoice> invoices = invoiceRepository.findByGeneratedBy(userId);
        return invoices.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    private Invoice mapToEntity(InvoiceDTO invoiceDTO) {
        Invoice invoice = new Invoice();
        invoice.setId(invoiceDTO.getId());
        invoice.setInvoiceDate(invoiceDTO.getInvoiceDate());
        invoice.setAmount(invoiceDTO.getAmount());
        invoice.setDescription(invoiceDTO.getDescription());
        invoice.setStatus(invoiceDTO.getStatus());
        invoice.setGeneratedBy(invoiceDTO.getGeneratedBy());
        invoice.setMedicalRecordId(invoiceDTO.getMedicalRecordId());
        return invoice;
    }

    private InvoiceDTO mapToDTO(Invoice invoice) {
        InvoiceDTO invoiceDTO = new InvoiceDTO();
        invoiceDTO.setId(invoice.getId());
        invoiceDTO.setInvoiceDate(invoice.getInvoiceDate());
        invoiceDTO.setAmount(invoice.getAmount());
        invoiceDTO.setDescription(invoice.getDescription());
        invoiceDTO.setStatus(invoice.getStatus());
        invoiceDTO.setGeneratedBy(invoice.getGeneratedBy());
        invoiceDTO.setMedicalRecordId(invoice.getMedicalRecordId());
        return invoiceDTO;
    }
}