package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.dto.DoctorDto;
import com.corilus.user_profile_management.entity.Doctor;
import com.corilus.user_profile_management.entity.UserInfo;
import com.corilus.user_profile_management.enums.ROLE;
import com.corilus.user_profile_management.enums.SPECIALITY;
import com.corilus.user_profile_management.exception.InvalidSpecialityException;
import com.corilus.user_profile_management.repository.DoctorRepository;
import com.corilus.user_profile_management.repository.UserInfoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserInfoRepository userInfoRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository, UserInfoRepository userInfoRepository) {
        this.doctorRepository = doctorRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    @Transactional
    public Doctor createDoctor(DoctorDto doctorDto) {
        UserInfo userInfo = new UserInfo();
        userInfo.setName(doctorDto.getName());
        userInfo.setPhone(doctorDto.getPhone());
        userInfo.setEmail(doctorDto.getEmail());
        userInfo.setPassword(doctorDto.getPassword());
        userInfo.setAddress(doctorDto.getAddress());
        userInfo.setRole(ROLE.DOCTOR);

        userInfo = userInfoRepository.save(userInfo);

        Doctor doctor = new Doctor();
        doctor.setDoctorInfo(userInfo);
        doctor.setMedicalLicenseNumber(doctorDto.getMedicalLicenseNumber());
        doctor.setSpeciality(doctorDto.getSpeciality());

        return doctorRepository.save(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }


    @Override
    @Transactional
    public Doctor updateDoctor(Long id, DoctorDto doctorDto) {
        Optional<Doctor> existingDoctor = doctorRepository.findById(id);
        if (existingDoctor.isPresent()) {
            Doctor doctor = existingDoctor.get();
            UserInfo userInfo = doctor.getDoctorInfo();

            userInfo.setName(doctorDto.getName());
            userInfo.setPhone(doctorDto.getPhone());
            userInfo.setEmail(doctorDto.getEmail());
            userInfo.setPassword(doctorDto.getPassword());
            userInfo.setAddress(doctorDto.getAddress());

            userInfoRepository.save(userInfo);

            doctor.setMedicalLicenseNumber(doctorDto.getMedicalLicenseNumber());
            doctor.setSpeciality(doctorDto.getSpeciality());

            return doctorRepository.save(doctor);
        } else {
            throw new RuntimeException("Doctor with ID " + id + " not found.");
        }
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
        } else {
            throw new RuntimeException("Doctor with ID " + id + " does not exist.");
        }
    }


    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor with ID " + id + " not found."));
    }

    @Override
    public List<Doctor> getDoctorsBySpeciality(String speciality) {
        try {
            SPECIALITY specialityEnum = SPECIALITY.valueOf(speciality.toUpperCase());
            return doctorRepository.findBySpeciality(specialityEnum);
        } catch (IllegalArgumentException e) {
            throw new InvalidSpecialityException(speciality);
        }
    }

    @Override
    public List<Doctor> getDoctorByName(String name) {
        return doctorRepository.findByDoctorInfo_Name(name);
    }
}
