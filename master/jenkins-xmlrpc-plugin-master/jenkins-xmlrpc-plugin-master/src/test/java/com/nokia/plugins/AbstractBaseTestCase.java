package com.nokia.plugins;

import hudson.model.Project;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Hashtable;

import org.jenkins.plugins.xmlrpcplugin.handlers.JenkinsXmlRpcApiHandler;
import org.junit.Test;
import org.jvnet.hudson.test.HudsonTestCase;


public abstract class AbstractBaseTestCase extends HudsonTestCase {
    private String TEST_PROJECT_CONFIG = "/test_project_config.xml";
    public static final String JENKINS_PROJECT = "test_project";

    
    private URL getTestProjectConfigUrl() {
        return getClass().getResource(TEST_PROJECT_CONFIG);
    }
    
    @Test
    public void testdataExists() throws Exception {
        assertNotNull(getTestProjectConfigUrl());
    }
    
    /**
     * Create VBR jenkins project
     * @throws Exception
     */
    protected void createTestProject() throws Exception {
        if (hudson.getProjects().isEmpty()) {
            hudson.createProjectFromXML(JENKINS_PROJECT, getTestProjectConfigUrl().openStream());
        }
    }
    
    
    @SuppressWarnings("rawtypes")
    protected Project getTestProject() {
        for (Project project: hudson.getProjects()) {
            if (project.getName().equals(JENKINS_PROJECT)) {
                return project;
            }
        }
        return null;
    }
}
