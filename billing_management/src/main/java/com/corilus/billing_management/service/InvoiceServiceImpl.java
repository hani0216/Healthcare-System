package com.corilus.billing_management.service;

import com.corilus.billing_management.dto.DoctorDto;
import com.corilus.billing_management.dto.InvoiceDTO;
import com.corilus.billing_management.entity.Invoice;
import com.corilus.billing_management.enums.Status;
import com.corilus.billing_management.exception.ResourceNotFoundException;
import com.corilus.billing_management.repository.InvoiceRepository;
import com.corilus.billing_management.client.DoctorClient;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import java.util.Date;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final DoctorClient doctorClient;

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        try {
            validateDoctor(invoiceDTO.getGeneratedBy());

            Invoice invoice = new Invoice();
            invoice.setAmount(invoiceDTO.getAmount());
            invoice.setDescription(invoiceDTO.getDescription());
            invoice.setGeneratedBy(invoiceDTO.getGeneratedBy());
            invoice.setMedicalRecordId(invoiceDTO.getMedicalRecordId());
            invoice.setInvoiceDate(new Timestamp(System.currentTimeMillis()));
            invoice.setStatus(Status.PENDING);

            Invoice savedInvoice = invoiceRepository.save(invoice);

            return mapToDTO(savedInvoice);
        } catch (Exception e) {
            throw new RuntimeException("Invoice creation failed: Author not found with this Id " );
        }
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
    private void validateDoctor(Long doctorId) {
        DoctorDto doctor = doctorClient.getDoctorById(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Doctor not found with id: " + doctorId);
        }
    }
}