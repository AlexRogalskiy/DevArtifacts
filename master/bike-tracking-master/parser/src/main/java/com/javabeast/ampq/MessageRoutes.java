package com.javabeast.ampq;


import com.javabeast.TextMessage;
import com.javabeast.TrackerMessage;
import com.javabeast.processors.*;
import com.javabeast.teltonikia.TeltonikaMessage;
import com.rabbitmq.client.Channel;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;


/**
 * Created by jeffreya on 05/11/2016.
 */

@Component
public class MessageRoutes {

    private Log log = LogFactory.getLog(MessageRoutes.class);

    @Autowired
    private Geocoder geocoder;

    @Autowired
    private MessageParser messageParser;

    @Autowired
    private IOEvents ioEvents;

    @Autowired
    private ClientEventService clientEventService;

    @Autowired
    private TrackerMessageService trackerMessageService;

    @Autowired
    private MessageService messageService;


    @RabbitListener(queues = "unprocessed")
    public void unprocessedQueue(TeltonikaMessage teltonikaMessage, Channel channel,
                                 @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        messageParser.addToQueue(teltonikaMessage);
        channel.basicAck(tag, true);
    }

    @RabbitListener(bindings = @QueueBinding(value = @Queue(value = "trackermessage", durable = "true"),
            exchange = @Exchange(value = "spring-boot-exchange", ignoreDeclarationExceptions = "true", type = "topic", durable = "true"),
            key = "orderRoutingKey"))
    public void trackerMessageQueue(TrackerMessage trackerMessage, Channel channel,
                                    @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        final boolean save = trackerMessageService.save(trackerMessage);
        if (save) {
            pushToRoutes(trackerMessage);
        }
        channel.basicAck(tag, save);
    }

    @RabbitListener(bindings = @QueueBinding(value = @Queue(value = "reversegeocode", durable = "true"),
            exchange = @Exchange(value = "spring-boot-exchange", ignoreDeclarationExceptions = "true", type = "topic", durable = "true"),
            key = "orderRoutingKey"))
    public void reverseGeocode(TrackerMessage message, Channel channel,
                               @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        final boolean shouldAck = geocoder.reverseGeocode(message);
        channel.basicAck(tag, shouldAck);
        if (shouldAck) {
            clientEventService.addToQueue(ClientEvent.builder()
                    .eventType("GEOCODED")
                    .trackerMessage(message)
                    .build());
        }
    }

    @RabbitListener(bindings = @QueueBinding(value = @Queue(value = "ioevents", durable = "true"),
            exchange = @Exchange(value = "spring-boot-exchange", ignoreDeclarationExceptions = "true", type = "topic", durable = "true"),
            key = "orderRoutingKey"))
    public void ioevents(TrackerMessage message, Channel channel,
                         @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        ioEvents.processEvents(message);

        clientEventService.addToQueue(ClientEvent.builder()
                .eventType("ioevented")
                .trackerMessage(message)
                .build());
        channel.basicAck(tag, true);
    }

    @RabbitListener(bindings = @QueueBinding(value = @Queue(value = "textmessage", durable = "true"),
            exchange = @Exchange(value = "spring-boot-exchange", ignoreDeclarationExceptions = "true", type = "topic", durable = "true"),
            key = "orderRoutingKey"))
    public void textMessages(TextMessage message, Channel channel,
                             @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        messageService.processEvents(message);
        channel.basicAck(tag, true);
    }


    @RabbitListener(bindings = @QueueBinding(value = @Queue(value = "client.updates", durable = "true"),
            exchange = @Exchange(value = "spring-boot-exchange", ignoreDeclarationExceptions = "true", type = "topic", durable = "true"),
            key = "orderRoutingKey"))
    public void clientUpdates(ClientEvent clientEvent, Channel channel,
                              @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
    }


    private void pushToRoutes(final TrackerMessage message) {
        geocoder.addToQueue(message);
        ioEvents.addToQueue(message);
    }

}
