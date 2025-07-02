package com.corilus.medical_records_management.service;

import com.corilus.medical_records_management.entity.Authorizations;
import com.corilus.medical_records_management.enums.AuthorizationStatus;

public interface AuthorizationsService {
    Authorizations addDoctor(int doctorId);
    AuthorizationStatus getAuthorizationStatus(int doctorId, int medicalRecordId);
    void addStatus(int doctorId, int medicalRecordId, AuthorizationStatus status);

}