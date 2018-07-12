package com.javabeast.processors;

import com.javabeast.TrackerMessage;
import com.javabeast.geocode.GeocodedLocation;
import com.javabeast.repo.GeocodedLocationRepo;
import com.javabeast.repo.GpsElementRepo;
import com.javabeast.repo.TrackerMessageRepo;
import com.javabeast.services.GeocodeService;
import com.javabeast.teltonikia.GpsElement;
import lombok.extern.log4j.Log4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;


@Log4j
@Service
public class Geocoder {


    @Value("${trackr.reversegeocode.queue}")
    private String reverseGeocoderQueue;

    private final RabbitTemplate rabbitTemplate;

    private final TrackerMessageRepo trackerMessageRepo;

    private final GpsElementRepo gpsElementRepo;

    private final GeocodeService geocodeService;

    @Autowired
    public Geocoder(final RabbitTemplate rabbitTemplate, final TrackerMessageRepo trackerMessageRepo,
                    final GeocodeService geocodeService,
                    final GpsElementRepo gpsElementRepo) {
        this.rabbitTemplate = rabbitTemplate;
        this.trackerMessageRepo = trackerMessageRepo;
        this.geocodeService = geocodeService;
        this.gpsElementRepo = gpsElementRepo;
    }

    public void addToQueue(final TrackerMessage message) {
        rabbitTemplate.convertAndSend("reversegeocode", message);
    }

    public boolean reverseGeocode(final TrackerMessage trackerMessage) {
        final GpsElement gpsElement = trackerMessage.getGpsElement();

        try {
            final String position = getPositionString(gpsElement);
            final GeocodedLocation geocodedLocation = geocodeService.getGeocodedLocation(position);
            gpsElement.setGeocodedLocation(geocodedLocation);
            gpsElementRepo.save(gpsElement);
          //  trackerMessageRepo.save(trackerMessage);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    private String getPositionString(final GpsElement gpsElement) {
        return gpsElement.getLatitude() + "," + gpsElement.getLongitude();
    }

}