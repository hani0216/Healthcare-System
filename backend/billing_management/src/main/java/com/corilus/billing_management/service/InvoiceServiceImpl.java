package com.corilus.billing_management.service;

import com.corilus.billing_management.client.DoctorClient;
import com.corilus.billing_management.client.HistoryClient;
import com.corilus.billing_management.dto.DoctorDto;
import com.corilus.billing_management.dto.InvoiceDTO;
import com.corilus.billing_management.entity.Invoice;
import com.corilus.billing_management.enums.HistoryType;
import com.corilus.billing_management.enums.Status;
import com.corilus.billing_management.exception.ResourceNotFoundException;
import com.corilus.billing_management.repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final DoctorClient doctorClient;
    private final HistoryClient historyClient;
    private static final Logger log = LoggerFactory.getLogger(InvoiceServiceImpl.class);


    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        try {
            try {
                validateDoctor(invoiceDTO.getGeneratedBy());
            } catch (Exception e) {
                log.error("Erreur lors de la validation du docteur: {}", e.getMessage());
                throw new RuntimeException("Erreur de validation du docteur: " + e.getMessage());
            }

            Invoice invoice = new Invoice();
            invoice.setAmount(invoiceDTO.getAmount());
            invoice.setDescription(invoiceDTO.getDescription());
            invoice.setGeneratedBy(invoiceDTO.getGeneratedBy());
            invoice.setMedicalRecordId(invoiceDTO.getMedicalRecordId());
            invoice.setInvoiceDate(new Timestamp(System.currentTimeMillis()));
            invoice.setStatus(Status.PENDING);

            Long medicalRecordId = invoice.getMedicalRecordId();

            historyClient.createHistory(medicalRecordId, HistoryType.INVOICE_GENERATED);

            Invoice savedInvoice = invoiceRepository.save(invoice);

            return mapToDTO(savedInvoice);
        } catch (Exception e) {
            log.error("Erreur lors de la création de la facture", e);
            throw new RuntimeException("Erreur lors de la création de la facture: " + e.getMessage());
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
    @Transactional
    public InvoiceDTO updateInvoice(Long id, InvoiceDTO invoiceDTO) {
        Invoice existingInvoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        // Mise à jour des champs
        if (invoiceDTO.getAmount() != null) {
            existingInvoice.setAmount(invoiceDTO.getAmount());
        }
        if (invoiceDTO.getDescription() != null) {
            existingInvoice.setDescription(invoiceDTO.getDescription());
        }
        if (invoiceDTO.getStatus() != null) {
            existingInvoice.setStatus(invoiceDTO.getStatus());
        }
        if (invoiceDTO.getInvoiceDate() != null) {
            existingInvoice.setInvoiceDate(invoiceDTO.getInvoiceDate());
        }
        if (invoiceDTO.getMedicalRecordId() != null) {
            existingInvoice.setMedicalRecordId(invoiceDTO.getMedicalRecordId());
        }

        if (invoiceDTO.getGeneratedBy() != null) {
            existingInvoice.setGeneratedBy(invoiceDTO.getGeneratedBy());
        }

        Invoice updatedInvoice = invoiceRepository.save(existingInvoice);

        Long medicalRecordId = updatedInvoice.getMedicalRecordId();

        historyClient.createHistory(medicalRecordId, HistoryType.INVOICE_UPDATED);
        log.info("Historique créé avec succès pour la facture ID: {}", updatedInvoice.getId());


        InvoiceDTO updatedInvoiceDTO = new InvoiceDTO();
        updatedInvoiceDTO.setId(updatedInvoice.getId());
        updatedInvoiceDTO.setAmount(updatedInvoice.getAmount());
        updatedInvoiceDTO.setDescription(updatedInvoice.getDescription());
        updatedInvoiceDTO.setStatus(updatedInvoice.getStatus());
        updatedInvoiceDTO.setInvoiceDate(updatedInvoice.getInvoiceDate());
        updatedInvoiceDTO.setMedicalRecordId(updatedInvoice.getMedicalRecordId());
        updatedInvoiceDTO.setGeneratedBy(updatedInvoice.getGeneratedBy());

        return updatedInvoiceDTO;
    }


    @Override
    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
        Long medicalRecordId = invoice.getMedicalRecordId();
        historyClient.createHistory(medicalRecordId, HistoryType.INVOICE_DELETED);

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