package com.corilus.medical_records_management.repository;

import com.corilus.medical_records_management.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {


}
