package com.corilus.Auth_service.mapper;

import com.corilus.Auth_service.dto.SignupRequest;
import com.corilus.Auth_service.dto.DoctorDto;
import com.corilus.Auth_service.dto.InsuranceAdminDto;
import com.corilus.Auth_service.dto.PatientDto;
import org.springframework.stereotype.Component;
import com.corilus.Auth_service.enums.SPECIALITY;

@Component
public class UserProfileMapper {

    // Conversion vers DoctorDto
    public DoctorDto toDoctorDto(SignupRequest request) {
        DoctorDto dto = new DoctorDto();
        dto.setName(request.getFirstName() + " " + request.getLastName());
        dto.setEmail(request.getEmail());
        dto.setPassword(request.getPassword());
        dto.setAddress(null);
        dto.setPhone(null);
        dto.setMedicalLicenseNumber(null);
        dto.setSpeciality(SPECIALITY.GENERAL);
        return dto;
    }

    // Conversion vers InsuranceAdminDto
    public InsuranceAdminDto toInsuranceAdminDto(SignupRequest request) {
        InsuranceAdminDto dto = new InsuranceAdminDto();
        dto.setName(request.getFirstName() + " " + request.getLastName());
        dto.setEmail(request.getEmail());
        dto.setPassword(request.getPassword());
        dto.setInsuranceCompany(null);
        dto.setInsuranceLicenseNumber(null);
        return dto;
    }

    // Conversion vers PatientDto
    public PatientDto toPatientDto(SignupRequest request) {
        PatientDto dto = new PatientDto();
        dto.setName(request.getFirstName() + " " + request.getLastName());
        dto.setEmail(request.getEmail());
        dto.setPassword(request.getPassword());
        dto.setAddress(null);
        dto.setPhone(null);
        return dto;
    }
}
