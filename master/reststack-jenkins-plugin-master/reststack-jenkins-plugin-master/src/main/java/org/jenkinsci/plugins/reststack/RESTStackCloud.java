package org.jenkinsci.plugins.reststack;

import hudson.Launcher;
import hudson.Extension;
import hudson.util.FormValidation;
import hudson.Util;
import hudson.model.Computer;
import hudson.model.Descriptor;
import hudson.model.Hudson;
import hudson.model.Label;
import hudson.model.Node;
import hudson.model.labels.LabelAtom;
import hudson.slaves.Cloud;
import hudson.slaves.NodeProvisioner.PlannedNode;
import hudson.slaves.OfflineCause;
import hudson.model.TaskListener;
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

//import org.jenkinsci.plugins.reststack.RESTStackSlaveTemplate;

public class RESTStackCloud extends Cloud {
    private static final Logger LOGGER = Logger.getLogger(RESTStackCloud.class.getName());

    private final List<RESTStackSlaveTemplate> templates;
    private final String provisionerUrl;
    private final String authToken;
    private final int maxSlaves;

    protected transient int plannedNodes;

    @DataBoundConstructor
    public RESTStackCloud(String name, String provisionerUrl, String authToken,
                          int maxSlaves,
		         final List<RESTStackSlaveTemplate> templates) {
        super(name);
        if (templates != null)
            this.templates = templates;
        else
            this.templates = Collections.<RESTStackSlaveTemplate> emptyList();

        this.provisionerUrl = Util.fixEmptyAndTrim(provisionerUrl);
        this.authToken = Util.fixEmptyAndTrim(authToken);
        this.maxSlaves = maxSlaves;
        this.plannedNodes = 0;

        readResolve();
    }

    public boolean canProvision(Label label) {
        return getTemplate(label) != null;
    }

    public String getProvisionerUrl() {
        return provisionerUrl;
    }

    public String getAuthToken() {
        return authToken;
    }

    public int getMaxSlaves() {
        return maxSlaves;
    }

    public RESTStackSlaveTemplate getTemplate(Label label) {
        for (RESTStackSlaveTemplate t : templates)
            if (label == null || label.matches(t.getLabelSet()))
                return t;
        return null;
    }


    public synchronized void incPlannedNodes() {
        ++this.plannedNodes;
    }

    public synchronized void decPlannedNodes() {
        --this.plannedNodes;
    }

    public synchronized Collection<PlannedNode> provision(Label label, int excessWorkloads) {
        final RESTStackSlaveTemplate slaveTemplate = getTemplate(label);
        List<PlannedNode> nodes = new ArrayList<PlannedNode>();
        int activeSlaves = 0;

        for (final Node n : Jenkins.getActiveInstance().getNodes()) {
            if (!(n instanceof RESTStackSlave))
                continue;

            final RESTStackSlave node = (RESTStackSlave) n;

            if (node != null && !node.isPendingDelete())
                ++activeSlaves;
        }

        activeSlaves += this.plannedNodes;

        while ((excessWorkloads > 0) &&
                ((getMaxSlaves() == 0) || (activeSlaves < getMaxSlaves()))) {
            incPlannedNodes();

            nodes.add(new PlannedNode(slaveTemplate.getName(),
                Computer.threadPoolForRemoting.submit(new Callable<Node>() {
                    public Node call() throws Exception {
                        RESTStackSlave slave = slaveTemplate.provisionSlave();
                        decPlannedNodes();
                        return slave;
                    }
            }), 1));

            ++activeSlaves;
            excessWorkloads -= 1;
        }
        return nodes;
    }

    protected Object readResolve() {
        for (RESTStackSlaveTemplate template : templates) {
            template.cloud = this;
        }
        return this;
    }

    public List<RESTStackSlaveTemplate> getTemplates() {
        return Collections.unmodifiableList(templates);
    }

    @Extension
    public static class DescriptorImpl extends Descriptor<Cloud> {
        public String getDisplayName() {
            return "RESTStack";
        }

        public FormValidation doTestConnection(@QueryParameter("provisionerUrl") final String provisionerUrl,
                @QueryParameter("authToken") final String authToken) throws IOException, ServletException {
            try {
                RESTStackProvisioner.testConnection(provisionerUrl, authToken);
                return FormValidation.ok("Success");
            } catch (RESTStackProvisioner.PermissionDeniedException e) {
                return FormValidation.error("Permission Denied: " + e.getMessage());
            } catch (IOException e) {
                return FormValidation.error("IO error: " + e.getMessage());
            }
        }

        public FormValidation doCheckMaxSlaves(@QueryParameter String value) {
            try {
                Integer maxSlaves = Integer.parseInt(value);
                if (maxSlaves < 0)
                    return FormValidation.error("Must not be negative");
                else
                    return FormValidation.ok();
            } catch (NumberFormatException  e) {
                return FormValidation.error("Not a number");
            }
        }
    }
}
