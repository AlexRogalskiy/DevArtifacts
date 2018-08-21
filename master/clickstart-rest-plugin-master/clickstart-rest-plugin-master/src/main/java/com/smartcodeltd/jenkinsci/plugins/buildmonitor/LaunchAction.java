package com.smartcodeltd.jenkinsci.plugins.buildmonitor;

import hudson.Extension;
import hudson.model.RootAction;

/**
 * Created by michaelneale on 30/07/2014.
 */
@Extension
public class LaunchAction implements RootAction {

    @Override
    public String getIconFileName() {
        return "blah";
    }

    @Override
    public String getDisplayName() {
        return "CloudBees EasyCloud";
    }

    @Override
    public String getUrlName() {
        return "/view/EasyCloud";
    }

}
