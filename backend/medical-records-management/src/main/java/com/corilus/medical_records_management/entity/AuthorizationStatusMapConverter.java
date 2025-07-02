package com.corilus.medical_records_management.entity;

import com.corilus.medical_records_management.enums.AuthorizationStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

@Converter
public class AuthorizationStatusMapConverter implements AttributeConverter<Map<Integer, AuthorizationStatus>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<Integer, AuthorizationStatus> attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la conversion en JSON", e);
        }
    }

    @Override
    public Map<Integer, AuthorizationStatus> convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, new TypeReference<Map<Integer, AuthorizationStatus>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la conversion depuis JSON", e);
        }
    }
}