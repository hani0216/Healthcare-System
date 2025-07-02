package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.entity.Authorizations;
import com.corilus.medical_records_management.enums.AuthorizationStatus;
import com.corilus.medical_records_management.repository.AuthorizationsRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationsServiceImpl implements AuthorizationsService {

    private final AuthorizationsRepository authorizationsRepository;

    public AuthorizationsServiceImpl(AuthorizationsRepository authorizationsRepository) {
        this.authorizationsRepository = authorizationsRepository;
    }

    @Override
    public Authorizations addDoctor(int doctorId) {
        // Avec la nouvelle structure d'entité, cette méthode n'a plus de sens
        // car une autorisation nécessite un doctorId ET un medicalRecordId
        return null;
    }

    @Override
    public AuthorizationStatus getAuthorizationStatus(int doctorId, int medicalRecordId) {
        return authorizationsRepository
                .findByDoctorIdAndMedicalRecordId(doctorId, medicalRecordId)
                .map(Authorizations::getStatus)
                .orElse(null);
    }

    @Override
    public void addStatus(int doctorId, int medicalRecordId, AuthorizationStatus status) {
        Authorizations authorization = authorizationsRepository
                .findByDoctorIdAndMedicalRecordId(doctorId, medicalRecordId)
                .orElse(new Authorizations());

        authorization.setDoctorId(doctorId);
        authorization.setMedicalRecordId(medicalRecordId);
        authorization.setStatus(status);

        authorizationsRepository.save(authorization);
    }
}