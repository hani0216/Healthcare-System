package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.dto.DoctorDto;
import com.corilus.user_profile_management.entity.Doctor;
import com.corilus.user_profile_management.enums.SPECIALITY;

import java.util.List;

public interface DoctorService {
    Doctor createDoctor(DoctorDto doctorDto);
    List<Doctor> getAllDoctors();
    Doctor updateDoctor(Long id, DoctorDto doctorDto);
    void deleteDoctor(Long id);
    Doctor getDoctorById(Long id);
    List<Doctor> getDoctorsBySpeciality(String speciality);
    List<Doctor> getDoctorByName(String name);
    List<String> getAllSpecialities();
    Doctor getDoctorByUserInfoId(Long userInfoId);
}
