package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.dto.MedicalRecordDto;
import com.corilus.user_profile_management.dto.PatientDto;
import com.corilus.user_profile_management.entity.Patient;
import com.corilus.user_profile_management.entity.UserInfo;
import com.corilus.user_profile_management.enums.ROLE;
import com.corilus.user_profile_management.repository.PatientRepository;
import com.corilus.user_profile_management.repository.UserInfoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.corilus.user_profile_management.client.MedicalRecordClient;

import java.util.List;
import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {

    private static final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);

    private final PatientRepository patientRepository;
    private final UserInfoRepository userInfoRepository;
    private final MedicalRecordClient medicalRecordClient;

    public PatientServiceImpl(PatientRepository patientRepository, UserInfoRepository userInfoRepository, MedicalRecordClient medicalRecordClient) {
        this.patientRepository = patientRepository;
        this.userInfoRepository = userInfoRepository;
        this.medicalRecordClient = medicalRecordClient;
    }

    @Override
    @Transactional
    public Patient createPatient(PatientDto dto) {
        logger.info("Début de la création d'un patient avec les données : {}", dto);

        UserInfo userInfo = new UserInfo();
        userInfo.setName(dto.getName());
        userInfo.setPhone(dto.getPhone());
        userInfo.setEmail(dto.getEmail());
        userInfo.setPassword(dto.getPassword());
        userInfo.setAddress(dto.getAddress());
        userInfo.setRole(ROLE.PATIENT);

        userInfo = userInfoRepository.save(userInfo);
        logger.info("Utilisateur associé créé avec succès : {}", userInfo);

        Patient patient = new Patient();
        patient.setPatientInfo(userInfo);
        patient.setBirthDate(dto.getBirthDate());
        patient.setCin(dto.getCin());
        patient.setInsuranceNumber(dto.getInsuranceNumber());
        patient.setInsurance(dto.getInsuranceName());

        Patient savedPatient = patientRepository.save(patient);
        logger.info("Patient créé avec succès : {}", savedPatient);

        MedicalRecordDto recordDto = new MedicalRecordDto();
        recordDto.setPatientId(savedPatient.getId());
        recordDto.setCreationDate(new java.util.Date());
        logger.info("Tentative de création d'un dossier médical pour le patient ID : {}", savedPatient.getId());

        try {
            medicalRecordClient.createMedicalRecord(recordDto);
            logger.info("Dossier médical créé avec succès pour le patient ID : {}", savedPatient.getId());
        } catch (Exception e) {
            logger.error("Erreur lors de la création du dossier médical pour le patient ID : {}. Détails : {}", savedPatient.getId(), e.getMessage(), e);
        }

        return savedPatient;
    }

    @Override
    @Transactional
    public Patient updatePatient(Long id, PatientDto dto) {
        logger.info("Début de la mise à jour du patient avec ID : {}", id);
        Optional<Patient> existing = patientRepository.findById(id);
        if (existing.isPresent()) {
            Patient patient = existing.get();
            UserInfo userInfo = patient.getPatientInfo();

            if (dto.getName() != null) {
                userInfo.setName(dto.getName());
            }
            if (dto.getPhone() != null) {
                userInfo.setPhone(dto.getPhone());
            }
            if (dto.getEmail() != null) {
                userInfo.setEmail(dto.getEmail());
            }
            if (dto.getPassword() != null) {
                userInfo.setPassword(dto.getPassword());
            }
            if (dto.getAddress() != null) {
                userInfo.setAddress(dto.getAddress());
            }
            userInfoRepository.save(userInfo);

            if (dto.getBirthDate() != null) {
                patient.setBirthDate(dto.getBirthDate());
            }
            if (dto.getCin() != null) {
                patient.setCin(dto.getCin());
            }
            if (dto.getInsuranceNumber() != null) {
                patient.setInsuranceNumber(dto.getInsuranceNumber());
            }
            if (dto.getInsuranceName() != null) {
                patient.setInsurance(dto.getInsuranceName());
            }

            Patient updatedPatient = patientRepository.save(patient);
            logger.info("Patient mis à jour avec succès : {}", updatedPatient);
            return updatedPatient;
        } else {
            logger.error("Patient avec ID {} non trouvé.", id);
            throw new RuntimeException("Patient with ID " + id + " not found.");
        }
    }

    @Override
    public Long getPatientIdByName(String name) {
        logger.info("Recherche de l'ID du patient avec le nom : {}", name);
        Optional<Patient> patient = patientRepository.findByName(name);
        return patient.map(Patient::getId).orElseThrow(() -> {
            logger.error("Aucun patient trouvé avec le nom : {}", name);
            return new RuntimeException("No patient found with name: " + name);
        });
    }

    @Override
    public void deletePatient(Long id) {
        logger.info("Suppression du patient avec ID : {}", id);
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            logger.info("Patient avec ID {} supprimé avec succès.", id);
        } else {
            logger.error("Patient avec ID {} n'existe pas.", id);
            throw new RuntimeException("Patient with ID " + id + " does not exist.");
        }
    }

    @Override
    public Patient getPatientById(Long id) {
        logger.info("Recherche du patient avec ID : {}", id);
        return patientRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Patient avec ID {} non trouvé.", id);
                    return new RuntimeException("Patient with ID " + id + " not found.");
                });
    }

    @Override
    public List<Patient> getAllPatients() {
        logger.info("Récupération de tous les patients.");
        return patientRepository.findAll();
    }

    @Override
    public Patient getPatientByUserInfoId(Long userInfoId) {
        logger.info("Recherche du patient avec l'ID de UserInfo : {}", userInfoId);
        return patientRepository.findByPatientInfoId(userInfoId)
                .orElseThrow(() -> {
                    logger.error("Patient non trouvé pour l'ID de UserInfo : {}", userInfoId);
                    return new RuntimeException("Patient not found for user info ID: " + userInfoId);
                });
    }
}