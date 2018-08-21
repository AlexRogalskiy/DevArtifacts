package org.jenkinsci.plugins.reststack;

import hudson.model.Computer;
import hudson.model.Hudson;
import hudson.model.Label;
import hudson.model.Node;
import hudson.model.labels.LabelAtom;
import hudson.slaves.Cloud;
import hudson.slaves.SlaveComputer;
import hudson.slaves.NodeProvisioner.PlannedNode;
import hudson.slaves.OfflineCause;
import hudson.model.TaskListener;
import hudson.model.Descriptor;
import hudson.model.Describable;
import hudson.slaves.AbstractCloudComputer;
import jenkins.model.Jenkins;

import org.kohsuke.stapler.HttpRedirect;
import org.kohsuke.stapler.HttpResponse;

import javax.servlet.ServletException;
import java.io.IOException;

import java.util.logging.Logger;

public class RESTStackComputer extends AbstractCloudComputer<RESTStackSlave> {
    private static final Logger LOGGER = Logger.getLogger(RESTStackComputer.class.getName());

    public RESTStackComputer(RESTStackSlave slave) {
        super(slave);
    }

    public RESTStackSlave getNode() {
        return (RESTStackSlave) super.getNode();
    }

    public HttpResponse doDoDelete() throws IOException {
        LOGGER.info("doDoDelete() called!");
        setTemporarilyOffline(true, OfflineCause.create(Messages._DeletedCause()));
        if (getNode() != null) {
            try {
                getNode().terminate();
            } catch (IOException e) {
                Jenkins.getActiveInstance().removeNode(getNode());
            } catch (InterruptedException e) {
                Jenkins.getActiveInstance().removeNode(getNode());
            }
        }

        return new HttpRedirect("..");
    }
}
