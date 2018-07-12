package com.javabeast.processors;

import com.javabeast.TrackerMessage;
import com.javabeast.teltonikia.AVLData;
import com.javabeast.teltonikia.TeltonikaMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;



@Service
public class MessageParser {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MessageParser(final RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void addToQueue(final TeltonikaMessage teltonikaMessage) {
        final List<TrackerMessage> trackerMessages = getTrackerMessages(teltonikaMessage);
        for (final TrackerMessage trackerMessage : trackerMessages) {
            rabbitTemplate.convertAndSend("trackermessage", trackerMessage);
        }
    }

    private List<TrackerMessage> getTrackerMessages(final TeltonikaMessage message) {
        final List<TrackerMessage> trackerMessageList = new ArrayList<>();
        final String imei = message.getAvlPacketHeader().getImei();
        for (final AVLData avlData : message.getAvlData()) {
            trackerMessageList.add(TrackerMessage.builder()
                    .imei(imei)
                    .gpsElement(avlData.getGpsElement())
                    .ioEvents(avlData.getIoEventList())
                    .timestamp(avlData.getTimestamp())
                    .build());
        }
        return trackerMessageList;
    }

}