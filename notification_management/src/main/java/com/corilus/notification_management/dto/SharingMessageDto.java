package com.corilus.notification_management.dto;


public class SharingMessageDto {

    private Long receiverId;
    private String description;

    // Getters and Setters
    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
