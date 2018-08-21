package org.jenkins.plugins.jenkinsrest;

import java.util.HashMap;

/**
 * Created by tsutsumi on 11/8/14.
 */
public enum EventType {

    JOB_STARTED("job_started"),
    JOB_COMPLETED("job_completed");

    public final String name;

    EventType(String _name) {
        name = _name;
    }
}
