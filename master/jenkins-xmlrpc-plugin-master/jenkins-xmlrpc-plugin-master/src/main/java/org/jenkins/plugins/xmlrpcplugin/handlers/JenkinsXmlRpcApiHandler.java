package org.jenkins.plugins.xmlrpcplugin.handlers;

import hudson.model.Hudson;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class JenkinsXmlRpcApiHandler {

    private final Log log = LogFactory.getLog(getClass());

    public String getJenkinsVersion() {
        return Hudson.getVersion().toString();
    }

    /**
     * Get the names of all Jenkins projects.
     * @return
     */
    public ArrayList<String> getProjects() {
        return null;
    }

    /**
     * Tell if project exists with the given name
     * @param projectName
     * @return
     */
    public boolean projectExists(String projectName) {
        return false;
    }

    /**
     * Trigger a new build of the given project
     * @param projectName
     */
    public void buildProject(String projectName) {

    }

    /**
     * Trigger a new build of the given parametrized project
     * @param projectName
     */
    public void buildProject(String projectName, List<String> parameters) {

    }

    public void createProject() {
        
    }
    public void copyProject() {
        
    }
    
    public void deleteProject() {
        
    }
    public void disableProject(String projectName) {
        
    }
    public void enableProject(String projectName) {
        
    }
    public void getProjectConfig(String projectName) {
        
    }
    public void getProjectInfo(String projectName) {
        
    }
    public void reconfigProject(String configXml, String projectName) {
        
    }
    public boolean nodeExists(String nodeName) {
        return false;
    }
    public void getNodeInfo(String nodeName) {
        
    }
    public void createNode() {
        
    }
    
    public void getQueueInfo() {
        
    }
    public void getJenkinsInfo() {
        
    }
}
