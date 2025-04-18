package com.corilus.billing_management.controller;

import com.corilus.billing_management.dto.ReimbursementDTO;
import com.corilus.billing_management.service.ReimbursementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reimbursements")
@RequiredArgsConstructor
public class ReimbursementController {

    private final ReimbursementService reimbursementService;

    @PostMapping
    public ResponseEntity<ReimbursementDTO> createReimbursement(@RequestBody ReimbursementDTO reimbursementDTO) {
        ReimbursementDTO createdReimbursement = reimbursementService.createReimbursement(reimbursementDTO);
        return new ResponseEntity<>(createdReimbursement, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReimbursementDTO> getReimbursementById(@PathVariable Long id) {
        ReimbursementDTO reimbursement = reimbursementService.getReimbursementById(id);
        return ResponseEntity.ok(reimbursement);
    }

    @GetMapping
    public ResponseEntity<List<ReimbursementDTO>> getAllReimbursements() {
        List<ReimbursementDTO> reimbursements = reimbursementService.getAllReimbursements();
        return ResponseEntity.ok(reimbursements);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReimbursementDTO> updateReimbursement(@PathVariable Long id, @RequestBody ReimbursementDTO reimbursementDTO) {
        ReimbursementDTO updatedReimbursement = reimbursementService.updateReimbursement(id, reimbursementDTO);
        return ResponseEntity.ok(updatedReimbursement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReimbursement(@PathVariable Long id) {
        reimbursementService.deleteReimbursement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<ReimbursementDTO>> getReimbursementsByInvoiceId(@PathVariable Long invoiceId) {
        List<ReimbursementDTO> reimbursements = reimbursementService.getReimbursementsByInvoiceId(invoiceId);
        return ResponseEntity.ok(reimbursements);
    }

    @GetMapping("/insured/{insuredId}")
    public ResponseEntity<List<ReimbursementDTO>> getReimbursementsByInsuredId(@PathVariable Long insuredId) {
        List<ReimbursementDTO> reimbursements = reimbursementService.getReimbursementsByInsuredId(insuredId);
        return ResponseEntity.ok(reimbursements);
    }
}