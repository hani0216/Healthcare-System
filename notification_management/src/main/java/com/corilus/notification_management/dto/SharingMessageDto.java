package com.corilus.notification_management.dto;
import com.corilus.notification_management.enums.ResourceType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SharingMessageDto {

    private Long receiverId;
    private String description;
    private ResourceType resourceType;
    private Long SenderId;
    private Long resourceId;


}
