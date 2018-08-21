package org.jazzteam.jenkinstest.models;

import org.apache.log4j.Logger;
import org.jazzteam.jenkinstest.logic.FunctionFactory;
import org.jazzteam.jenkinstest.utils.PropertyHandler;

public class JenkinsModel {
    private static final Logger LOG = Logger.getLogger(JenkinsModel.class);
    private String jenkins_quiet_down_url = PropertyHandler.getProperty("jenkins_quiet_down_url");
    private String jenkins_cancel_quiet_down_url = PropertyHandler.getProperty("jenkins_cancel_quiet_down_url");
    private String jenkins_restart_url = PropertyHandler.getProperty("jenkins_restart_url");
    private String jenkins_safe_restart_url = PropertyHandler.getProperty("jenkins_safe_restart_url");

    private enum Functions {jenkins_quiet_down, jenkins_cancel_quiet_down,
        jenkins_restart, jenkins_safe_restart}

    public int jenkinsQuietDown(){
        return new FunctionFactory().function(Functions.jenkins_quiet_down.name(), jenkins_quiet_down_url);
    }

    public int jenkinsCancelQuietDown(){
        return new FunctionFactory().function(Functions.jenkins_cancel_quiet_down.name(), jenkins_cancel_quiet_down_url);
    }

    public int jenkinsRestart(){
        return new FunctionFactory().function(Functions.jenkins_restart.name(), jenkins_restart_url);
    }

    public int jenkinsSafeRestart(){
        return new FunctionFactory().function(Functions.jenkins_safe_restart.name(), jenkins_safe_restart_url);
    }
}
