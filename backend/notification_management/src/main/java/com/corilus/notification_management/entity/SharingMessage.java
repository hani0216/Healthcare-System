package com.corilus.notification_management.entity;

import com.corilus.notification_management.enums.ResourceType;
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

    @Column(name = "resource_type")
    @Enumerated(EnumType.STRING)
    private ResourceType resourceType;


    private Timestamp sendingDate;

    private Boolean seen=false;

    private String description;

}
