package org.jenkins.plugins.jenkinsrest;

import java.util.Map;

/**
 * Created by tsutsumi on 11/8/14.
 */
public class Event {

    public final EventType eventType;
    public final Map<String, Object> attributes;

    public Event(EventType eventType, Map<String, Object> attributes) {
        this.eventType = eventType;
        this.attributes = attributes;
    }
}
