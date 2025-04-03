package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.dto.PatientDto;
import com.corilus.user_profile_management.entity.Patient;
import com.corilus.user_profile_management.entity.UserInfo;
import com.corilus.user_profile_management.enums.ROLE;
import com.corilus.user_profile_management.repository.PatientRepository;
import com.corilus.user_profile_management.repository.UserInfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserInfoRepository userInfoRepository;

    public PatientServiceImpl(PatientRepository patientRepository, UserInfoRepository userInfoRepository) {
        this.patientRepository = patientRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    @Transactional
    public Patient createPatient(PatientDto dto) {
        UserInfo userInfo = new UserInfo();
        userInfo.setName(dto.getName());
        userInfo.setPhone(dto.getPhone());
        userInfo.setEmail(dto.getEmail());
        userInfo.setPassword(dto.getPassword());
        userInfo.setAddress(dto.getAddress());
        userInfo.setRole(ROLE.PATIENT);

        userInfo = userInfoRepository.save(userInfo);

        Patient patient = new Patient();
        patient.setPatientInfo(userInfo);
        patient.setBirthDate(dto.getBirthDate());
        patient.setCin(dto.getCin());
        patient.setInsuranceNumber(dto.getInsuranceNumber());
        patient.setInsurance(dto.getInsuranceName());

        return patientRepository.save(patient);
    }

    @Override
    @Transactional
    public Patient updatePatient(Long id, PatientDto dto) {
        Optional<Patient> existing = patientRepository.findById(id);
        if (existing.isPresent()) {
            Patient patient = existing.get();
            UserInfo userInfo = patient.getPatientInfo();

            userInfo.setName(dto.getName());
            userInfo.setPhone(dto.getPhone());
            userInfo.setEmail(dto.getEmail());
            userInfo.setPassword(dto.getPassword());
            userInfo.setAddress(dto.getAddress());
            userInfoRepository.save(userInfo);

            patient.setBirthDate(dto.getBirthDate());
            patient.setCin(dto.getCin());
            patient.setInsuranceNumber(dto.getInsuranceNumber());
            patient.setInsurance(dto.getInsuranceName());

            return patientRepository.save(patient);
        } else {
            throw new RuntimeException("Patient with ID " + id + " not found.");
        }
    }

    // Dans PatientServiceImpl.java
    @Override
    public Long getPatientIdByName(String name) {
        Optional<Patient> patient = patientRepository.findByName(name);
        return patient.map(Patient::getId).orElseThrow(() -> new RuntimeException("No patient found with name: " + name));
    }


    @Override
    public void deletePatient(Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
        } else {
            throw new RuntimeException("Patient with ID " + id + " does not exist.");
        }
    }

    @Override
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient with ID " + id + " not found."));
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
}
