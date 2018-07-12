package com.javabeast.processors;

import com.javabeast.TrackerMessage;
import com.javabeast.domain.gecode.VehicleTimeline;
import com.javabeast.teltonikia.GpsElement;
import com.javabeast.teltonikia.IOEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


/**
 * Created by jeffreya on 06/11/2016.
 */

@Service
public class IOEvents {

    @Value("${trackr.ioevents.queue}")
    private String ioEventsQueue;

    private final RabbitTemplate rabbitTemplate;

    private final Map<String, VehicleTimeline> imeiToVehicleTimeline = new ConcurrentHashMap<>();

    @Autowired
    public IOEvents(final RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void addToQueue(final TrackerMessage message) {
        rabbitTemplate.convertAndSend("ioevents", message);
    }


    public void processEvents(final TrackerMessage message) {
        final List<IOEvent> ioEvents = message.getIoEvents();
        for (final IOEvent ioEvent : ioEvents) {

            if (ioEvent.getType() == 240) {
                final boolean moving = ioEvent.getValue() == 1;
                System.out.println(moving ? "Vehicle moving" : "vehicle stopped");
            }

        }


    }

    private boolean didGpsMove(final TrackerMessage lastRecievedMessage, final TrackerMessage message) {
        final String lastMessageLatLng = lastRecievedMessage.getGpsElement().getLatLngString();
        final String currentMessageLatLng = message.getGpsElement().getLatLngString();
        return !lastMessageLatLng.equals(currentMessageLatLng);

    }

    public synchronized void processEvents2(final TrackerMessage message) {
        final GpsElement gpsElement = message.getGpsElement();
        final String currentLatLng = gpsElement.getLatLngString();
        final String imei = message.getImei();

        addEntryIfAbsent(message, imei);


        final Foo lastEvent = null;

        final String previousLatLng = lastEvent.getMessage().getGpsElement().getLatLngString();
        State currentState;
        boolean ignitionOnEvent = false;
        boolean ignitionOffEvent = false;
        Date previousDate = lastEvent.getLastMoved();

        if (!previousLatLng.equals(currentLatLng)) {
            //final String[] position = previousLatLng.split(",");
            //final double distance = distance(gpsElement.getLatitude(), gpsElement.getLongitude(), Double.parseDouble(position[0]), Double.parseDouble(position[1]), 'K');
            if (lastEvent.getCurrentState() == State.STOPPED) {
                ignitionOnEvent = true;
            }
            lastEvent.setCurrentState(State.MOVING);
            lastEvent.setMessage(message);
            lastEvent.setLastMoved(message.getTimestamp());
        } else {

            if (lastEvent.getCurrentState() != State.STOPPED) {

                final long currentTime = message.getTimestamp().getTime();
                final long lastMovedTime = lastEvent.getLastMoved().getTime();
                final long timeDifference = (currentTime - lastMovedTime);
                final long minuteInMs = 60000;
                final long minuteDiff = timeDifference / minuteInMs;

                if (minuteDiff < 5) {
                    lastEvent.setCurrentState(State.IDLE);
                } else {
                    if (lastEvent.getCurrentState() == State.IDLE) {
                        ignitionOffEvent = true;
                    }
                    // lastEvent.setLastMoved(message.getTimestamp());
                    lastEvent.setCurrentState(State.STOPPED);
                }
            }
            lastEvent.setMessage(message);
        }


        if (ignitionOnEvent) {
            System.out.println("Ignition turned ON" + message.getTimestamp());
        }

        if (ignitionOffEvent) {
            System.out.println("Ignition turned OFF" + message.getTimestamp());
        }
        //System.out.println("Current state:" + currentState);
    }

    private void addEntryIfAbsent(TrackerMessage message, String imei) {
        final Foo foo = new Foo();
        foo.setMessage(message);
        foo.setLastMoved(message.getTimestamp());
        foo.setCurrentState(State.STOPPED);
        // imeiToVehicleTimeline.putIfAbsent(imei, foo);
    }

    private double distance(double lat1, double lon1, double lat2, double lon2, char unit) {
        double theta = lon1 - lon2;
        double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
        dist = Math.acos(dist);
        dist = rad2deg(dist);
        dist = dist * 60 * 1.1515;
        if (unit == 'K') {
            dist = (dist * 1.609344);
        } else if (unit == 'N') {
            dist = dist * 0.8684;
        }
        return dist;
    }

    private double deg2rad(double deg) {
        return (deg * Math.PI / 180.0);
    }

    private double rad2deg(double rad) {
        return (rad * 180.0 / Math.PI);
    }


    private static class Foo {
        private TrackerMessage message;
        private Date lastMoved;
        private State currentState;

        private TrackerMessage startJourney;
        private TrackerMessage endJourney;

        public TrackerMessage getMessage() {
            return message;
        }

        public void setMessage(TrackerMessage message) {
            this.message = message;
        }

        public Date getLastMoved() {
            return lastMoved;
        }

        public void setLastMoved(Date lastMoved) {
            this.lastMoved = lastMoved;
        }

        public State getCurrentState() {
            return currentState;
        }

        public void setCurrentState(State currentState) {
            this.currentState = currentState;
        }

        public TrackerMessage getStartJourney() {
            return startJourney;
        }

        public void setStartJourney(TrackerMessage startJourney) {
            this.startJourney = startJourney;
        }

        public TrackerMessage getEndJourney() {
            return endJourney;
        }

        public void setEndJourney(TrackerMessage endJourney) {
            this.endJourney = endJourney;
        }
    }

    private enum State {
        STOPPED,
        IDLE,
        MOVING
    }
}