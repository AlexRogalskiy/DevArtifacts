package org.jenkins.plugins.jenkinsrest;

import hudson.Extension;
import hudson.model.TaskListener;
import hudson.model.Run;
import hudson.model.listeners.RunListener;

import java.util.HashMap;
import java.util.Map;

@Extension
public class ListenerRun extends hudson.model.listeners.RunListener<Run> {

    public static Event generateEvent(EventType eventType, Run r) {
        Map attributes = new HashMap<String, Object>();
        attributes.put("run", r);
        attributes.put("job", r.getParent());
        return new Event(eventType, attributes);
    }

    @Override
    public void onStarted(Run r, TaskListener listener) {
        JenkinsRest.notifyStatic(generateEvent(EventType.JOB_STARTED, r));
    }

	@Override
	public void onCompleted(Run r, TaskListener listener) {
        JenkinsRest.notifyStatic(generateEvent(EventType.JOB_COMPLETED, r));
	}


}
