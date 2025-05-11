package com.corilus.notification_management.service;

import com.corilus.notification_management.dto.SharingMessageDto;
import com.corilus.notification_management.entity.SharingMessage;
import com.corilus.notification_management.repository.SharingMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SharingMessageServiceImpl implements SharingMessageService {

    @Autowired
    private SharingMessageRepository sharingMessageRepository;

    @Override
    public List<SharingMessage> getAllMessages() {
        return sharingMessageRepository.findAll();
    }

    public SharingMessage createMessage(SharingMessageDto sharingMessageDto) {
        SharingMessage sharingMessage = new SharingMessage();
        sharingMessage.setReceiverId(sharingMessageDto.getReceiverId());
        sharingMessage.setResourceId(sharingMessageDto.getResourceId());
        sharingMessage.setResourceType(sharingMessageDto.getResourceType());
        sharingMessage.setSenderId(sharingMessageDto.getSenderId());
        sharingMessage.setSendingDate(new java.sql.Timestamp(System.currentTimeMillis()));
        sharingMessage.setDescription(sharingMessageDto.getDescription());
        return sharingMessageRepository.save(sharingMessage);
    }

    @Override
    public SharingMessage getMessageById(Long id) {
        return sharingMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }

    @Override
    public List<SharingMessage> getMessagesBySenderId(Long senderId) {
        return sharingMessageRepository.findBySenderId(senderId);
    }

    @Override
    public List<SharingMessage> getMessagesByReceiverId(Long receiverId) {
        return sharingMessageRepository.findByReceiverId(receiverId);
    }



    @Override
    public SharingMessage updateMessage(Long id, SharingMessage sharingMessageDetails) {
        SharingMessage sharingMessage = sharingMessageRepository.findById(id).orElseThrow();
        sharingMessage.setSeen(sharingMessageDetails.getSeen());
        return sharingMessageRepository.save(sharingMessage);
    }

    @Override
    public void deleteMessage(Long id) {
        sharingMessageRepository.deleteById(id);
    }
}
