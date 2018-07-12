package com.javabeast.domain.gecode;

import com.javabeast.TrackerMessage;
import com.javabeast.teltonikia.GpsElement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VehicleTimeline {
    private TrackerMessage lastMovedMessage;
    private TrackerMessage lastRecievedMessage;

}