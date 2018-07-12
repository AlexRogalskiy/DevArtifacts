package com.javabeast.ampq;

import com.javabeast.service.TeltonikaUDPToMessageService;
import com.javabeast.teltonikia.TeltonikaMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.xml.bind.DatatypeConverter;
import java.io.File;
import java.io.FileOutputStream;


/**
 * Created by jeffreya on 07/11/2016.
 * Message Parser
 */

//@Service
public class UdpMessageParser {


    @Value("${trackr.unprocessed.queue}")
    private String unprocessedQueue;

    private final RabbitTemplate rabbitTemplate;

    private final TeltonikaUDPToMessageService teltonikaUDPToMessageService;


    @Autowired
    public UdpMessageParser(final RabbitTemplate rabbitTemplate, final TeltonikaUDPToMessageService teltonikaUDPToMessageService) {
        this.rabbitTemplate = rabbitTemplate;
        this.teltonikaUDPToMessageService = teltonikaUDPToMessageService;
    }

    public void parseMessage(final byte[] bytes) {
       // System.out.println("MessageParser.parseMessage");

        final TeltonikaMessage teltonikaMessage = teltonikaUDPToMessageService.convertUDPToMessage(bytes);
        System.out.println(teltonikaMessage);
       // rabbitTemplate.convertAndSend(unprocessedQueue, teltonikaMessage);
    }



    public static String toHexString(byte[] array) {
        return DatatypeConverter.printHexBinary(array);
    }

    public static byte[] toByteArray(String s) {
        return DatatypeConverter.parseHexBinary(s);
    }

}
