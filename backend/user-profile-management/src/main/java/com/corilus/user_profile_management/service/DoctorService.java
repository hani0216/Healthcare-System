package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.dto.DoctorDto;
import com.corilus.user_profile_management.entity.Doctor;

import java.util.List;

public interface DoctorService {
    Doctor createDoctor(DoctorDto doctorDto);
    Doctor updateDoctor(Long id, DoctorDto doctorDto);
    void deleteDoctor(Long id);
    List<Doctor> getAllDoctors();
    Doctor getDoctorById(Long id);
    List<Doctor> getDoctorsBySpeciality(String speciality);
    List<Doctor> getDoctorByName(String name);
}
