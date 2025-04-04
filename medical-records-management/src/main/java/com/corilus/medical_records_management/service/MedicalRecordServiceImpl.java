package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.client.DoctorClient;
import com.corilus.medical_records_management.client.PatientClient;
import com.corilus.medical_records_management.dto.DoctorDto;
import com.corilus.medical_records_management.dto.MedicalRecordDto;
import com.corilus.medical_records_management.entity.MedicalRecord;
import com.corilus.medical_records_management.entity.Note;
import com.corilus.medical_records_management.repository.MedicalRecordRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final DoctorClient doctorClient;
    private final PatientClient patientClient;

    @Override
    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    public Long findPatientIdByName(String name) {
        try {
            Long patientId = patientClient.getPatientIdByName(name);
            if (patientId != null) {
                return patientId;
            } else {
                throw new PatientNotFoundException("No patient found with name: " + name);
            }
        } catch (FeignException e) {
            throw new RuntimeException("Failed to fetch patient ID for name: " + name, e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error occurred while fetching patient ID for name: " + name, e);
        }
    }

    public class PatientNotFoundException extends RuntimeException {
        public PatientNotFoundException(String message) {
            super(message);
        }
    }

    @Override
    public MedicalRecord createMedicalRecord(MedicalRecordDto medicalRecordDto) {
        if (!validateDoctor(medicalRecordDto.getDoctorId())) {
            throw new RuntimeException("Doctor not found with id: " + medicalRecordDto.getDoctorId());
        }
        MedicalRecord record = new MedicalRecord();
        record.setPatientId(medicalRecordDto.getPatientId());
        record.setNote(new Note());
        record.setDocuments(new ArrayList<>());
        record.setAppointments(new ArrayList<>());
        record.setLogs(new ArrayList<>());
        return medicalRecordRepository.save(record);
    }

    @Override
    public MedicalRecord getMedicalRecordByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId)
                .orElseThrow(() -> new RuntimeException("Medical record not found for patientId: " + patientId));
    }

    @Override
    public MedicalRecord getMedicalRecordByPatientName(String name) {
        Long patientId = findPatientIdByName(name);
        return getMedicalRecordByPatientId(patientId);
    }

    @Override
    public MedicalRecord getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id));
    }

    private boolean validateDoctor(Long doctorId) {
        try {
            DoctorDto doctor = doctorClient.getDoctorById(doctorId);
            return doctor != null;
        } catch (Exception e) {
            return false;
        }
    }
}
