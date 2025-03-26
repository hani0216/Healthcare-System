package com.corilus.user_profile_management.service;
import java.util.List;
import com.corilus.user_profile_management.dto.PatientDto;
import com.corilus.user_profile_management.entity.Patient;

public interface PatientService {
    Patient createPatient(PatientDto patientDto);
    Patient updatePatient(Long id, PatientDto patientDto);
    void deletePatient(Long id);
    Patient getPatientById(Long id);
    List<Patient> getAllPatients();

}
