package com.corilus.medical_records_management.dto;

import com.corilus.medical_records_management.enums.AuthorizationStatus;

public class AddStatusRequest {
    private int doctorId;
    private int medicalRecordId;
    private AuthorizationStatus status;

    // Constructeur par défaut
    public AddStatusRequest() {
    }

    // Constructeur avec paramètres
    public AddStatusRequest(int doctorId, int medicalRecordId, AuthorizationStatus status) {
        this.doctorId = doctorId;
        this.medicalRecordId = medicalRecordId;
        this.status = status;
    }

    // Getters et setters
    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public int getMedicalRecordId() {
        return medicalRecordId;
    }

    public void setMedicalRecordId(int medicalRecordId) {
        this.medicalRecordId = medicalRecordId;
    }

    public AuthorizationStatus getStatus() {
        return status;
    }

    public void setStatus(AuthorizationStatus status) {
        this.status = status;
    }
}