package org.fkunnen.jenkinsrestapi.jobcontrol;

import com.offbytwo.jenkins.JenkinsServer;
import org.junit.Before;
import org.junit.Test;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

public class JenkinsJobControlServiceTest {


    public static final String JENKINS_URL = "http://localhost:18080";
    public static final String JENKINS_USER = "jenkins";
    public static final String JENKINS_AUTH_TOKEN = "e59a919aaf58258fd1d5e40486413486";

    private JenkinsJobControlService jenkinsJobControlService;

    @Before
    public void setUp() throws URISyntaxException {
        jenkinsJobControlService = new JenkinsJobControlService(new JenkinsServer(new URI(JENKINS_URL), JENKINS_USER, JENKINS_AUTH_TOKEN));
    }


    @Test
    public void startBuild() throws Exception {
        jenkinsJobControlService.startBuild("HelloWorld");
    }

    @Test
    public void startParameterizedBuild() throws Exception {
        Map<String, String> parameters = new HashMap<>();
        parameters.put("firstName", "Frank");
        parameters.put("lastName", "Kunnen");

        jenkinsJobControlService.startParameterizedBuild("HelloPerson", parameters);
    }

    @Test
    public void getNextBuildNumber() throws Exception {
        jenkinsJobControlService.getNextBuildNumber("HelloWorld");
    }

    @Test
    public void startBuildWithNotification() throws Exception {
        jenkinsJobControlService.startBuild("HelloWorldWithNotification");

        //Make it sleep to keep the application alive hosting the notification rest service
        Thread.sleep(60000L);
    }
}