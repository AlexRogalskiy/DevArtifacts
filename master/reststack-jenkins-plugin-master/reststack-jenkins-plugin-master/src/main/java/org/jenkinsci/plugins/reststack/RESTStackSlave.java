package org.jenkinsci.plugins.reststack;

import hudson.Launcher;
import hudson.Extension;
import hudson.util.FormValidation;
import hudson.Util;
import hudson.model.Computer;
import hudson.model.Hudson;
import hudson.model.Label;
import hudson.model.Node;
import hudson.model.labels.LabelAtom;
import hudson.slaves.Cloud;
import hudson.slaves.NodeProvisioner.PlannedNode;
import hudson.slaves.OfflineCause;
import hudson.model.TaskListener;
import hudson.model.Descriptor;
import hudson.model.Describable;
import hudson.slaves.AbstractCloudComputer;
import hudson.slaves.AbstractCloudSlave;
import hudson.slaves.NodeProperty;
import hudson.slaves.ComputerLauncher;
import hudson.slaves.RetentionStrategy;
import hudson.util.StreamTaskListener;
import jenkins.model.Jenkins;

import net.sf.json.JSONObject;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;
import org.kohsuke.stapler.QueryParameter;

import javax.servlet.ServletException;
import java.io.IOException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.Objects;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.logging.Logger;

public class RESTStackSlave extends AbstractCloudSlave {
    private static final Logger LOGGER = Logger.getLogger(RESTStackSlave.class.getName());
    private final String jvmOptions;
    private final String credentialsId;
    private final String host;
    private final String remoteFs;
    private final int port;
    private final Node.Mode mode;
    private final String cloudName;
    private boolean pendingDelete;

    protected transient RESTStackCloud cloud;

    public RESTStackSlave(String cloudName, String name, String host, int port, String nodeDescription,
            String remoteFs, String jvmOptions, String credentialsId, int numExecutors, Node.Mode mode,
            String labelString, RetentionStrategy retentionStrategy, List<? extends NodeProperty<?>> nodeProperties) throws Descriptor.FormException, IOException {
        super(name, nodeDescription, remoteFs, numExecutors, mode, labelString, new RESTStackLauncher(), retentionStrategy, nodeProperties);
        this.cloudName = cloudName;
        this.credentialsId = credentialsId;
        this.name = name;
        this.remoteFs = remoteFs;
        this.jvmOptions = jvmOptions;
        this.mode = mode;
        this.host = host;
        this.port = port;
        this.pendingDelete = false;
        LOGGER.info("Creating new slave " + name + " on cloud " + cloudName + ", ip: " + host + ", port: " + port);
    }

    public AbstractCloudComputer<RESTStackSlave> createComputer() {
        return new RESTStackComputer(this);
    }

    public RESTStackCloud getCloud() {
        return (RESTStackCloud) Jenkins.getActiveInstance().getCloud(cloudName);
    }

    public void terminate() throws IOException, InterruptedException {
        LOGGER.info("terminate() called on slave " + name);
        RESTStackProvisioner.terminateSlave(this);
        Jenkins.getActiveInstance().removeNode(this);
    }

    protected void _terminate(TaskListener listener) throws IOException, InterruptedException {
        terminate();
    }

    public String getCredentialsId() {
        return credentialsId;
    }

    public String getJvmOptions() {
        return jvmOptions;
    }

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }

    public boolean isPendingDelete() {
        return pendingDelete;
    }

    public void setPendingDelete(boolean pendingDelete) {
        this.pendingDelete = pendingDelete;
    }

    @Extension
    public static final class RESTStackSlaveDescriptor extends SlaveDescriptor {
        public String getDisplayName() {
            return "RESTStack Slave";
        }

        public boolean isInstantiable() {
            return false;
        }
    }
}

