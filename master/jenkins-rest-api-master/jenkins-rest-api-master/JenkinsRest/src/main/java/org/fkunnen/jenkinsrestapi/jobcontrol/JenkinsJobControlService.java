package org.fkunnen.jenkinsrestapi.jobcontrol;

import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.JobWithDetails;
import com.offbytwo.jenkins.model.QueueReference;

import java.io.IOException;
import java.util.Map;

public class JenkinsJobControlService {

    private JenkinsServer jenkinsServer;

    public JenkinsJobControlService(JenkinsServer jenkinsServer) {
        this.jenkinsServer = jenkinsServer;
    }

    public void startBuild(String jobName) throws IOException {
        JobWithDetails job = jenkinsServer.getJob(jobName);
        QueueReference build = job.build(true);
        System.out.println(build.getQueueItemUrlPart());
    }

    public void startParameterizedBuild(String jobName, Map<String, String> parameters) throws IOException {
        JobWithDetails job = jenkinsServer.getJob(jobName);
        QueueReference build = job.build(parameters, true);
        System.out.println(build.getQueueItemUrlPart());
    }

    public void getNextBuildNumber(String jobName) throws IOException {
        JobWithDetails job = jenkinsServer.getJob(jobName);
        System.out.println(job.getNextBuildNumber());
    }

}
