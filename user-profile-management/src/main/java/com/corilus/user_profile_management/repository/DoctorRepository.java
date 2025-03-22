package com.corilus.user_profile_management.repository;

import com.corilus.user_profile_management.entity.Doctor;
import com.corilus.user_profile_management.enums.SPECIALITY;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpeciality(SPECIALITY speciality);
    List<Doctor> findByDoctorInfo_Name(String name);
}
