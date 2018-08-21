package com.nokia.plugins;

import static org.junit.Assert.*;

import org.jenkins.plugins.xmlrpcplugin.JenkinsXmlRpcPlugin;
import org.junit.Before;
import org.junit.Test;

public class JenkinsXmlRpcPluginTest {

    private JenkinsXmlRpcPlugin xmlRpcPlugin;

    @Before
    public void before() {
        this.xmlRpcPlugin = new JenkinsXmlRpcPlugin();
    }
    
    @Test
    public void testUiSettings() {
        assertNull(xmlRpcPlugin.getIconFileName());
        assertNull(xmlRpcPlugin.getDisplayName());
        assertEquals("rpc", xmlRpcPlugin.getUrlName());
    }

    @Test
    public void testVersion() throws Exception {
        assertNotNull(JenkinsXmlRpcPlugin.VERSION);
        assertFalse("".equals(JenkinsXmlRpcPlugin.VERSION));
    }
}
