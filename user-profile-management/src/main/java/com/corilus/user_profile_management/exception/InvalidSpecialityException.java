package com.corilus.user_profile_management.exception;

public class InvalidSpecialityException extends RuntimeException {
    public InvalidSpecialityException(String speciality) {
        super("Invalid speciality: " + speciality);
    }
}
