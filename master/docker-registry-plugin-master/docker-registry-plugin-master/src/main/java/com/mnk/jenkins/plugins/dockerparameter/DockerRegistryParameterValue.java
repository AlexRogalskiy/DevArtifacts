package com.mnk.jenkins.plugins.dockerparameter;

import hudson.model.StringParameterValue;
import org.kohsuke.stapler.DataBoundConstructor;

public class DockerRegistryParameterValue extends StringParameterValue {
    private static final long serialVersionUID = 7993744779892776377L;

    @DataBoundConstructor
    public DockerRegistryParameterValue(String name, String value) {
        super(name, value);
    }
}
