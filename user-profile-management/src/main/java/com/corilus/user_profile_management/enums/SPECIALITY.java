package com.corilus.user_profile_management.enums;

import lombok.Getter;

@Getter
public enum SPECIALITY {

    ORTHODONTICS("Orthodontics", "Specialized in dental alignment"),
    GENERAL_DENTISTRY("General Dentistry", "Covers all standard dental procedures"),
    PERIODONTICS("Periodontics", "Focuses on gum diseases and implants"),
    ENDODONTICS("Endodontics", "Root canal specialist"),
    PROSTHODONTICS("Prosthodontics", "Specialist in dental prostheses"),
    PEDIATRIC_DENTISTRY("Pediatric Dentistry", "Dental care for children"),
    ORAL_AND_MAXILLOFACIAL_SURGERY("Oral & Maxillofacial Surgery", "Surgery for face, jaw, and mouth"),
    ORAL_PATHOLOGY("Oral Pathology", "Diagnosis of oral diseases"),
    IMPLANTOLOGY("Implantology", "Dental implants specialist"),
    CARDIOLOGY("Cardiology", "Heart and cardiovascular diseases"),
    DERMATOLOGY("Dermatology", "Skin diseases specialist"),
    NEUROLOGY("Neurology", "Brain and nervous system disorders"),
    OPHTHALMOLOGY("Ophthalmology", "Eye diseases specialist"),
    ORTHOPEDICS("Orthopedics", "Musculoskeletal system disorders"),
    PEDIATRICS("Pediatrics", "Medical care for children"),
    RADIOLOGY("Radiology", "Medical imaging and diagnostics"),
    ANESTHESIOLOGY("Anesthesiology", "Pain management and anesthesia"),
    PSYCHIATRY("Psychiatry", "Mental health disorders"),
    GYNECOLOGY("Gynecology", "Women's reproductive health"),
    ONCOLOGY("Oncology", "Cancer treatment specialist"),
    PULMONOLOGY("Pulmonology", "Lung and respiratory diseases"),
    GASTROENTEROLOGY("Gastroenterology", "Digestive system disorders"),
    RHEUMATOLOGY("Rheumatology", "Joint and autoimmune diseases"),
    ENDOCRINOLOGY("Endocrinology", "Hormonal and metabolic disorders");

    private final String displayName;
    private final String description;

    SPECIALITY(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
}
