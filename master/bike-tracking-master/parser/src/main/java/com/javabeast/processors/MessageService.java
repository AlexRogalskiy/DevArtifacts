package com.javabeast.processors;

import com.javabeast.TextMessage;
import com.javabeast.TrackerMessage;
import com.javabeast.services.TextService;
import lombok.extern.log4j.Log4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Log4j
@Service
public class MessageService {


    private final RabbitTemplate rabbitTemplate;
    private final TextService textService;


    @Autowired
    public MessageService(final RabbitTemplate rabbitTemplate, final TextService textService) {
        this.rabbitTemplate = rabbitTemplate;
        this.textService = textService;
    }

    public void addToQueue(final TrackerMessage message) {
        final TextMessage textMessage = TextMessage.builder().to("07712600491").message("Your bikes moving m8").build();
        rabbitTemplate.convertAndSend("textmessage", textMessage);
    }

    public boolean processEvents(final TextMessage textMessage) {
        textService.sendText(textMessage);
        return true;
    }

}