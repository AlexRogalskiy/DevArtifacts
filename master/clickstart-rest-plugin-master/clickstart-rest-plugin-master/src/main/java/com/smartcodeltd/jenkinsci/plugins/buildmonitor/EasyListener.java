package com.smartcodeltd.jenkinsci.plugins.buildmonitor;

import hudson.Extension;
import hudson.model.View;
import hudson.model.listeners.ItemListener;
import jenkins.model.Jenkins;

import java.io.File;
import java.io.IOException;

/**
 * Set up the easy cloud view.
 */
@Extension
public class EasyListener extends ItemListener {

    @Override
    public void onLoaded() {
        try {
            if (!new File(Jenkins.getInstance().getRootDir(), "easy-cloud").isFile()) {
                Jenkins.getInstance().addView(new BuildMonitorView("EasyCloud"));
                new File(Jenkins.getInstance().getRootDir(), "easy-cloud").createNewFile();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


}