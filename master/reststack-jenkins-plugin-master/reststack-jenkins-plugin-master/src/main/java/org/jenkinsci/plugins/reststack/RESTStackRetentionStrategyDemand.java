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
//import org.jenkinsci.plugins.durabletask.executors.ContinuableExecutable;

import jenkins.model.Jenkins;

import hudson.slaves.RetentionStrategy;
import hudson.util.TimeUnit2;

import org.kohsuke.stapler.DataBoundConstructor;


import javax.servlet.ServletException;

import java.io.IOException;

import java.util.logging.Logger;
import java.util.concurrent.Callable;


public class RESTStackRetentionStrategyDemand extends RetentionStrategy<RESTStackComputer> {
    private static final Logger LOGGER = Logger.getLogger(RESTStackRetentionStrategyDemand.class.getName());

    private final int idleTerminationMinutes;

    @DataBoundConstructor
    public RESTStackRetentionStrategyDemand(int idleTerminationMinutes) {
        this.idleTerminationMinutes = idleTerminationMinutes;
    }

    @Override
    public void start(final RESTStackComputer computer) {
        computer.connect(false);
    }

    @Override
    public long check(final RESTStackComputer computer) {
        if (computer.isIdle()) {
            final long idleMilliseconds = System.currentTimeMillis() - computer.getIdleStartMilliseconds();
            if (idleMilliseconds > TimeUnit2.MINUTES.toMillis(idleTerminationMinutes)) {
                terminateComputer(computer);
            }
        }
        return 1;
    }

    public static class DescriptorImpl extends Descriptor<RetentionStrategy<?>> {
        public String getDisplayName() {
            return "RESTStack";
        }
    }

    @Override
    public boolean isAcceptingTasks(final RESTStackComputer computer) {
        final RESTStackSlave node = computer.getNode();
        return (node != null && !node.isPendingDelete());
    }

    private void terminateComputer(final AbstractCloudComputer<RESTStackSlave> c) {
        final RESTStackSlave node = c.getNode();

        LOGGER.info("Marking computer " + c.getName() + " offline, as it is due for removal");
        c.setTemporarilyOffline(true, OfflineCause.create(Messages._DeletedCause()));
        if (node != null) {
            LOGGER.info("Marking node " + c.getName() + " for deletion");
            node.setPendingDelete(true);
        }

        //Queue.withLock();
        //Computer.threadPoolForRemoting.submit(new Runnable() {
        //    public void run() {
        //        final 
        //    }
        //});
    }
}
