package com.corilus.billing_management.controller;

import com.corilus.billing_management.dto.InvoiceDTO;
import com.corilus.billing_management.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/createInvoice/{medicalRecordId}/{authorId}")
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody InvoiceDTO invoiceDTO,
                                                    @PathVariable Long medicalRecordId,
                                                    @PathVariable Long authorId) {

        invoiceDTO.setMedicalRecordId(medicalRecordId);
        invoiceDTO.setGeneratedBy(authorId);
        invoiceDTO.setInvoiceDate(new java.sql.Timestamp(System.currentTimeMillis()));

        InvoiceDTO createdInvoice = invoiceService.createInvoice(invoiceDTO);
        return new ResponseEntity<>(createdInvoice, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDTO> getInvoiceById(@PathVariable Long id) {
        InvoiceDTO invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(invoice);
    }

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getAllInvoices() {
        List<InvoiceDTO> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(invoices);
    }

    @PutMapping("/{id}/{authorId}")
    public ResponseEntity<InvoiceDTO> updateInvoice(@PathVariable Long id,
                                                    @PathVariable Long authorId,
                                                    @RequestBody InvoiceDTO invoiceDTO) {
        InvoiceDTO existingInvoice = invoiceService.getInvoiceById(id);

        if (!authorId.equals(existingInvoice.getGeneratedBy())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        invoiceDTO.setGeneratedBy(existingInvoice.getGeneratedBy());

        if (invoiceDTO.getMedicalRecordId() == null) {
            invoiceDTO.setMedicalRecordId(existingInvoice.getMedicalRecordId());
        }

        invoiceDTO.setInvoiceDate(new java.sql.Timestamp(System.currentTimeMillis()));

        InvoiceDTO updatedInvoice = invoiceService.updateInvoice(id, invoiceDTO);
        return ResponseEntity.ok(updatedInvoice);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/medical-record/{medicalRecordId}")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesByMedicalRecordId(@PathVariable Long medicalRecordId) {
        List<InvoiceDTO> invoices = invoiceService.getInvoicesByMedicalRecordId(medicalRecordId);
        return ResponseEntity.ok(invoices);
    }
}