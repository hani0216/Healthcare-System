package com.corilus.user_profile_management.controller;

import com.corilus.user_profile_management.dto.DoctorDto;
import com.corilus.user_profile_management.entity.Doctor;
import com.corilus.user_profile_management.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody DoctorDto doctorDto) {
        return ResponseEntity.ok(doctorService.createDoctor(doctorDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody DoctorDto doctorDto) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, doctorDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/specialities")
    public ResponseEntity<List<String>> getAllSpecialities() {
        return ResponseEntity.ok(doctorService.getAllSpecialities());
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/speciality/{speciality}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<Doctor>> getDoctorsBySpeciality(@PathVariable String speciality) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpeciality(speciality));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<Doctor>> getDoctorByName(@PathVariable String name) {
        return ResponseEntity.ok(doctorService.getDoctorByName(name));
    }


}

