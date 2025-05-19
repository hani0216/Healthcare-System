package com.corilus.user_profile_management.service;

import com.corilus.user_profile_management.dto.DoctorDto;
import com.corilus.user_profile_management.entity.Doctor;
import com.corilus.user_profile_management.entity.UserInfo;
import com.corilus.user_profile_management.enums.ROLE;
import com.corilus.user_profile_management.enums.SPECIALITY;
import com.corilus.user_profile_management.exception.InvalidSpecialityException;
import com.corilus.user_profile_management.repository.DoctorRepository;
import com.corilus.user_profile_management.repository.UserInfoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {
    private static final Logger logger = LoggerFactory.getLogger(DoctorServiceImpl.class);
    private final DoctorRepository doctorRepository;
    private final UserInfoRepository userInfoRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository, UserInfoRepository userInfoRepository) {
        this.doctorRepository = doctorRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    @Transactional
    public Doctor createDoctor(DoctorDto doctorDto) {
        logger.info("Creating doctor with phone: {}", doctorDto.getPhone());
        UserInfo userInfo = new UserInfo();
        userInfo.setName(doctorDto.getName());
        userInfo.setPhone(doctorDto.getPhone());
        userInfo.setEmail(doctorDto.getEmail());
        userInfo.setPassword(doctorDto.getPassword());
        userInfo.setAddress(doctorDto.getAddress());
        userInfo.setRole(ROLE.DOCTOR);

        userInfo = userInfoRepository.save(userInfo);
        logger.info("Saved userInfo with phone: {}", userInfo.getPhone());

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
        logger.info("Updating doctor with ID: {}, phone from DTO: {}", id, doctorDto.getPhone());
        Optional<Doctor> existingDoctor = doctorRepository.findById(id);
        if (existingDoctor.isPresent()) {
            Doctor doctor = existingDoctor.get();
            UserInfo userInfo = doctor.getDoctorInfo();
            logger.info("Current phone before update: {}", userInfo.getPhone());

            // Update UserInfo fields only if they are not null
            if (doctorDto.getName() != null) {
                userInfo.setName(doctorDto.getName());
            }
            if (doctorDto.getPhone() != null) {
                userInfo.setPhone(doctorDto.getPhone());
                logger.info("Updated phone to: {}", userInfo.getPhone());
            }
            if (doctorDto.getEmail() != null) {
                userInfo.setEmail(doctorDto.getEmail());
            }
            if (doctorDto.getPassword() != null) {
                userInfo.setPassword(doctorDto.getPassword());
            }
            if (doctorDto.getAddress() != null) {
                userInfo.setAddress(doctorDto.getAddress());
            }

            userInfo = userInfoRepository.save(userInfo);
            logger.info("Saved userInfo with phone: {}", userInfo.getPhone());

            // Update Doctor fields only if they are not null
            if (doctorDto.getMedicalLicenseNumber() != null) {
                doctor.setMedicalLicenseNumber(doctorDto.getMedicalLicenseNumber());
            }
            if (doctorDto.getSpeciality() != null) {
                doctor.setSpeciality(doctorDto.getSpeciality());
            }

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

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllSpecialities() {
        return Arrays.stream(SPECIALITY.values())
                .map(SPECIALITY::name)
                .collect(Collectors.toList());
    }

    @Override
    public Doctor getDoctorByUserInfoId(Long userInfoId) {
        return doctorRepository.findByDoctorInfoId(userInfoId)
                .orElseThrow(() -> new RuntimeException("Doctor not found for user info ID: " + userInfoId));
    }
}
