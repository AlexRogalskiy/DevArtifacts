package com.javabeast.processors;

import com.javabeast.TrackerMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ClientEventService {


    @Value("${trackr.client.updates}")
    private String clientEventsQueue;

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public ClientEventService(final RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void addToQueue(final ClientEvent clientEvent) {
        //System.out.println("ClientEventService.addToQueue");
        //System.out.println("clientEvent = [" + clientEvent + "]");
        rabbitTemplate.convertAndSend(clientEventsQueue, clientEvent);
    }


}
