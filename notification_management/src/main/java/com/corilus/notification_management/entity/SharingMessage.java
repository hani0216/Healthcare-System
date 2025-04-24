package com.corilus.notification_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;
import java.sql.Timestamp;
import jakarta.persistence.*;

@Entity
@Getter
@Setter
public class SharingMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long resourceId;
    private Long senderId;
    private Long receiverId;

    private Timestamp sendingDate;

    private Boolean seen=false;

    private String description;

}
