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
        sharingMessage.setDescription(sharingMessageDto.getDescription());
        return sharingMessageRepository.save(sharingMessage);
    }


    @Override
    public SharingMessage updateMessage(Long id, SharingMessage sharingMessageDetails) {
        SharingMessage sharingMessage = sharingMessageRepository.findById(id).orElseThrow();
        sharingMessage.setResourceId(sharingMessageDetails.getResourceId());
        sharingMessage.setSenderId(sharingMessageDetails.getSenderId());
        sharingMessage.setReceiverId(sharingMessageDetails.getReceiverId());
        sharingMessage.setSendingDate(sharingMessageDetails.getSendingDate());
        sharingMessage.setSeen(sharingMessageDetails.getSeen());
        sharingMessage.setDescription(sharingMessageDetails.getDescription());
        return sharingMessageRepository.save(sharingMessage);
    }

    @Override
    public void deleteMessage(Long id) {
        sharingMessageRepository.deleteById(id);
    }
}
