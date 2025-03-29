package com.corilus.medical_records_management.repository;

import com.corilus.medical_records_management.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepository extends JpaRepository<History, Long> {
}
