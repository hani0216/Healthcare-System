package com.corilus.billing_management.service;

import com.corilus.billing_management.dto.ReimbursementDTO;
import com.corilus.billing_management.client.HistoryClient;
import com.corilus.billing_management.entity.Reimbursement;
import com.corilus.billing_management.enums.HistoryType;
import com.corilus.billing_management.enums.ReimbursementStatus;
import com.corilus.billing_management.exception.ResourceNotFoundException;
import com.corilus.billing_management.repository.ReimbursementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReimbursementServiceImpl implements ReimbursementService {

    private final ReimbursementRepository reimbursementRepository;
    private final HistoryClient historyClient;
    @Override
    public ReimbursementDTO createReimbursement(ReimbursementDTO reimbursementDTO) {
        Reimbursement reimbursement = mapToEntity(reimbursementDTO);


        Long medicalRecordId = reimbursement.getMedicalRecordId();

        historyClient.createHistory(medicalRecordId, HistoryType.INVOICE_GENERATED);
        Reimbursement savedReimbursement = reimbursementRepository.save(reimbursement);


        return mapToDTO(savedReimbursement);
    }

    @Override
    @Transactional(readOnly = true)
    public ReimbursementDTO getReimbursementById(Long id) {
        Reimbursement reimbursement = reimbursementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reimbursement not found with id: " + id));
        return mapToDTO(reimbursement);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReimbursementDTO> getAllReimbursements() {
        List<Reimbursement> reimbursements = reimbursementRepository.findAll();
        return reimbursements.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReimbursementDTO updateReimbursement(Long id, ReimbursementDTO reimbursementDTO) {
        Reimbursement reimbursement = reimbursementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reimbursement not found with id: " + id));

        reimbursement.setStatus(reimbursementDTO.getStatus());
        reimbursement.setAmount(reimbursementDTO.getAmount());
        reimbursement.setInvoiceId(reimbursementDTO.getInvoiceId());
        reimbursement.setInsuredId(reimbursementDTO.getInsuredId());

        Reimbursement updatedReimbursement = reimbursementRepository.save(reimbursement);
        return mapToDTO(updatedReimbursement);
    }

    @Override
    public void deleteReimbursement(Long id) {
        Reimbursement reimbursement = reimbursementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reimbursement not found with id: " + id));
        reimbursementRepository.delete(reimbursement);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReimbursementDTO> getReimbursementsByStatus(ReimbursementStatus status) {
        List<Reimbursement> reimbursements = reimbursementRepository.findByStatus(status);
        return reimbursements.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReimbursementDTO> getReimbursementsByInvoiceId(Long invoiceId) {
        List<Reimbursement> reimbursements = reimbursementRepository.findByInvoiceId(invoiceId);
        return reimbursements.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReimbursementDTO> getReimbursementsByInsuredId(Long insuredId) {
        List<Reimbursement> reimbursements = reimbursementRepository.findByInsuredId(insuredId);
        return reimbursements.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    private Reimbursement mapToEntity(ReimbursementDTO reimbursementDTO) {
        Reimbursement reimbursement = new Reimbursement();
        reimbursement.setId(reimbursementDTO.getId());
        reimbursement.setStatus(reimbursementDTO.getStatus());
        reimbursement.setAmount(reimbursementDTO.getAmount());
        reimbursement.setInvoiceId(reimbursementDTO.getInvoiceId());
        reimbursement.setInsuredId(reimbursementDTO.getInsuredId());
        return reimbursement;
    }

    private ReimbursementDTO mapToDTO(Reimbursement reimbursement) {
        ReimbursementDTO reimbursementDTO = new ReimbursementDTO();
        reimbursementDTO.setId(reimbursement.getId());
        reimbursementDTO.setStatus(reimbursement.getStatus());
        reimbursementDTO.setAmount(reimbursement.getAmount());
        reimbursementDTO.setInvoiceId(reimbursement.getInvoiceId());
        reimbursementDTO.setInsuredId(reimbursement.getInsuredId());
        return reimbursementDTO;
    }
}