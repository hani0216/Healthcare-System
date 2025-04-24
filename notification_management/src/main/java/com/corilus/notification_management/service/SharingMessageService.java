package com.corilus.notification_management.service;

import com.corilus.notification_management.entity.SharingMessage;
import com.corilus.notification_management.dto.SharingMessageDto;

import java.util.List;


public interface SharingMessageService {

    List<SharingMessage> getAllMessages();

    SharingMessage createMessage(SharingMessageDto sharingMessage);

    SharingMessage updateMessage(Long id, SharingMessage sharingMessageDetails);

    void deleteMessage(Long id);
}