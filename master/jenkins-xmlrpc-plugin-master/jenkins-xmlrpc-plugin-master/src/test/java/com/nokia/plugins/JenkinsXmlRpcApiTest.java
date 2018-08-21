package com.nokia.plugins;

import hudson.model.Hudson;

import org.jenkins.plugins.xmlrpcplugin.handlers.JenkinsXmlRpcApiHandler;
import org.junit.Test;

public class JenkinsXmlRpcApiTest extends AbstractBaseTestCase {
    protected JenkinsXmlRpcApiHandler xmlRpcHandler = new JenkinsXmlRpcApiHandler();

    @Test
    public void testGetJenkinsVersion() throws Exception {
            assertEquals(xmlRpcHandler.getJenkinsVersion(), Hudson.getVersion()
                    .toString());
    }
}
