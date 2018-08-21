package org.jenkinsci.plugins.reststack;

import hudson.model.Computer;
import hudson.model.Hudson;
import hudson.model.Label;
import hudson.model.Node;
import hudson.model.Queue;
import hudson.model.Executor;
import hudson.model.ExecutorListener;
import hudson.model.labels.LabelAtom;
import hudson.slaves.Cloud;
import hudson.slaves.SlaveComputer;
import hudson.slaves.NodeProvisioner.PlannedNode;
import hudson.slaves.OfflineCause;
import hudson.model.TaskListener;
import hudson.model.Descriptor;
import hudson.model.Describable;
import hudson.slaves.AbstractCloudComputer;

import hudson.Extension;
import hudson.model.AsyncPeriodicWork;
//import org.jenkinsci.plugins.durabletask.executors.ContinuableExecutable;

import jenkins.model.Jenkins;

import hudson.slaves.RetentionStrategy;
import hudson.util.TimeUnit2;

import org.kohsuke.stapler.DataBoundConstructor;


import javax.servlet.ServletException;

import java.io.IOException;

import java.util.logging.Logger;

@Extension
public final class RESTStackPeriodicCleaner extends AsyncPeriodicWork {
    private static final Logger LOGGER = Logger.getLogger(RESTStackPeriodicCleaner.class.getName());

    public RESTStackPeriodicCleaner() {
        super("RESTStackPeriodicCleaner");
    }

    @Override
    public long getRecurrencePeriod() {
        return MIN * 5;
    }

    @Override
    protected void execute(TaskListener listener) {
        LOGGER.info("Cleaner Task running now");

        synchronized(this) {
            for (final Computer c : Jenkins.getActiveInstance().getComputers()) {
                if (!(c instanceof RESTStackComputer))
                    continue;

                final RESTStackComputer computer = (RESTStackComputer) c;
                final RESTStackSlave node = computer.getNode();

                if (node == null || !node.isPendingDelete())
                    continue;

                try {
                    node.terminate();
                } catch (IOException e) {
                    LOGGER.warning("Failed to destroy node " + node.getNodeName() + ", " + e.getMessage());
                } catch (InterruptedException e) {
                    LOGGER.warning("Failed to destroy node " + node.getNodeName() + ", " + e.getMessage());
                }
            }
        }
    }
}
