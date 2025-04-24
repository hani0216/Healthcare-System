package com.corilus.notification_management.controller;


import com.corilus.notification_management.dto.SharingMessageDto;
import com.corilus.notification_management.entity.SharingMessage;
import com.corilus.notification_management.service.SharingMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sharing-messages")
public class SharingMessageController {

    @Autowired
    private SharingMessageService sharingMessageService;

    @GetMapping
    public List<SharingMessage> getSharingMessages() {
        return sharingMessageService.getAllMessages();
    }

    @PostMapping
    public SharingMessage createSharingMessage(@RequestBody SharingMessageDto sharingMessageDto) {
        return sharingMessageService.createMessage(sharingMessageDto);
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
