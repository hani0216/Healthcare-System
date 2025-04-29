package com.corilus.notification_management.controller;


import com.corilus.notification_management.dto.SharingMessageDto;
import com.corilus.notification_management.entity.SharingMessage;
import com.corilus.notification_management.service.SharingMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import lombok.Setter;

@RestController
@RequestMapping("/api/sharing-messages")
public class SharingMessageController {

    @Autowired
    private SharingMessageService sharingMessageService;

    @GetMapping
    public List<SharingMessage> getSharingMessages() {
        return sharingMessageService.getAllMessages();
    }

    @PostMapping("/{senderId}")
    public SharingMessage createSharingMessage(@PathVariable Long senderId, @RequestBody SharingMessageDto sharingMessageDto) {
        sharingMessageDto.setSenderId(senderId);
        return sharingMessageService.createMessage(sharingMessageDto);
    }

    @GetMapping("/{id}")
    public SharingMessage getSharingMessageById(@PathVariable Long id) {
        return sharingMessageService.getMessageById(id);
    }

    @GetMapping("/sender/{senderId}")
    public List<SharingMessage> getMessagesBySenderId(@PathVariable Long senderId) {
        return sharingMessageService.getMessagesBySenderId(senderId);
    }

    @GetMapping("/receiver/{receiverId}")
    public List<SharingMessage> getMessagesByReceiverId(@PathVariable Long receiverId) {
        return sharingMessageService.getMessagesByReceiverId(receiverId);
    }



    @PutMapping("/{id}")
    public SharingMessage updateSharingMessage(@PathVariable Long id, @RequestBody SharingMessage sharingMessageDetails) {
        return sharingMessageService.updateMessage(id, sharingMessageDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteSharingMessage(@PathVariable Long id) {
        sharingMessageService.deleteMessage(id);
    }
}
