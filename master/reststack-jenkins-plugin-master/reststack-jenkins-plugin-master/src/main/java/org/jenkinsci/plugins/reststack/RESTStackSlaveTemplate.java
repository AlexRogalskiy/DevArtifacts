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
import hudson.model.ItemGroup;
import hudson.model.Descriptor;
import hudson.model.Describable;
import hudson.slaves.AbstractCloudComputer;
import hudson.slaves.AbstractCloudSlave;
import hudson.slaves.NodeProperty;
import hudson.slaves.ComputerLauncher;
import hudson.slaves.RetentionStrategy;
import hudson.util.StreamTaskListener;
import jenkins.model.Jenkins;
import hudson.plugins.sshslaves.SSHLauncher;
import hudson.security.ACL;
import hudson.security.AccessControlled;
import hudson.util.FormValidation;
import hudson.util.ListBoxModel;
import hudson.util.Secret;
import com.trilead.ssh2.Connection;
import org.apache.http.HttpEntity;
import org.apache.http.StatusLine;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.ContentType;

import com.cloudbees.plugins.credentials.Credentials;
import com.cloudbees.plugins.credentials.CredentialsMatcher;
import com.cloudbees.plugins.credentials.CredentialsMatchers;
import com.cloudbees.plugins.credentials.CredentialsProvider;
import com.cloudbees.plugins.credentials.CredentialsScope;
import com.cloudbees.plugins.credentials.CredentialsStore;
import com.cloudbees.plugins.credentials.common.StandardUsernameCredentials;
import com.cloudbees.plugins.credentials.common.StandardUsernamePasswordCredentials;
import com.cloudbees.plugins.credentials.common.StandardUsernameListBoxModel;
import com.cloudbees.jenkins.plugins.sshcredentials.SSHAuthenticator;
import com.cloudbees.jenkins.plugins.sshcredentials.SSHUserPrivateKey;
import com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey;

import net.sf.json.JSONObject;
import net.sf.json.JSONException;
import org.kohsuke.stapler.AncestorInPath;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;
import org.kohsuke.stapler.QueryParameter;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;

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
import java.util.UUID;

public class RESTStackSlaveTemplate implements Describable<RESTStackSlaveTemplate> {
    private static final Logger LOGGER = Logger.getLogger(RESTStackSlaveTemplate.class.getName());

    private final String name;
    private final String description;
    private final String jvmOptions;
    private final String fsRoot;
    private String credentialsId;
    private final String retentionStrategyName;
    private final int idleTerminationMinutes;
    private final String imageId;
    private final String labelString;
    private final int port;
    private final Node.Mode mode;
    private final String customJsonOpts;

    protected transient RESTStackCloud cloud;
    private transient Set<LabelAtom> labelSet;

    @DataBoundConstructor
    public RESTStackSlaveTemplate(final String name, final String description,
        final String jvmOptions, final String fsRoot,
        final String credentialsId, final String retentionStrategyName,
        final int idleTerminationMinutes,
        final String imageId, final int port,
        final String customJsonOpts, final String labelString,
        final String mode) {
        this.name = Util.fixEmptyAndTrim(name);
        this.description = Util.fixEmptyAndTrim(description);
        this.jvmOptions = Util.fixEmptyAndTrim(jvmOptions);
        this.fsRoot = Util.fixEmptyAndTrim(fsRoot);
        this.credentialsId = Util.fixEmptyAndTrim(credentialsId);
        this.labelString = Util.fixNull(labelString);
        this.customJsonOpts = Util.fixEmptyAndTrim(customJsonOpts);
        this.imageId = Util.fixEmptyAndTrim(imageId);
        this.retentionStrategyName = Util.fixEmptyAndTrim(retentionStrategyName);
        this.idleTerminationMinutes = idleTerminationMinutes;
        this.port = port;
        this.mode = Node.Mode.valueOf(Util.fixNull(mode));

        readResolve();
    }

    public String getName() {
        return name;
    }

    public RESTStackCloud getCloud() {
        return cloud;
    }

    public Node.Mode getMode() {
        return mode;
    }

    public String getLabelString() {
        return labelString;
    }

    protected Object readResolve() {
        labelSet = Label.parse(labelString);
        return this;
    }

    public String getJvmOptions() {
        if (jvmOptions == null)
            return "";
        else
            return jvmOptions;
    }

    public String getCustomJsonOpts() {
        if (customJsonOpts == null)
            return "{}";
        else
            return customJsonOpts;
    }

    public JSONObject getBaseJson() {
        return JSONObject.fromObject(getCustomJsonOpts());
    }

    public String getFsRoot() {
        if (fsRoot == null || fsRoot.equals("")) {
            return "/tmp";
        } else {
            return fsRoot;
        }
    }

    public String getDescription() {
        return description;
    }

    public String getCredentialsId() {
        return credentialsId;
    }

    public String getImageId() {
        return imageId;
    }

    public String getRetentionStrategyName() {
        return retentionStrategyName;
    }

    public int getIdleTerminationMinutes() {
        return (idleTerminationMinutes < 1) ? 1 : idleTerminationMinutes;
    }

    public RetentionStrategy<?> getRetentionStrategy() {
        if (getRetentionStrategyName() == Constants.RETENTION_STRATEGY_DEMAND) {
            return new RESTStackRetentionStrategyDemand(getIdleTerminationMinutes());
        } else {
            return new RESTStackRetentionStrategyOnce(getIdleTerminationMinutes());
        }
    }

    public void setCredentialsId(final String value) {
        credentialsId = value;
    }

    public RESTStackSlave provisionSlave() throws IOException {
        try {
            return RESTStackProvisioner.provisionSlave(this);
        } catch (Descriptor.FormException e) {
            throw new AssertionError("Invalid configuration " + e.getMessage());
        }
    }

    public Descriptor<RESTStackSlaveTemplate> getDescriptor() {
        return Jenkins.getActiveInstance().getDescriptor(getClass());
    }

    public Set<LabelAtom> getLabelSet() {
        return labelSet;
    }

    @Extension
    public static final class DescriptorImpl extends Descriptor<RESTStackSlaveTemplate> {
        public String getDisplayName() {
            return null;
        }

        public ListBoxModel doFillCredentialsIdItems(@AncestorInPath ItemGroup context) {
            if (!(context instanceof AccessControlled ? (AccessControlled) context : Jenkins.getActiveInstance()).hasPermission(Computer.CONFIGURE)) {
                return new ListBoxModel();
            }
            return new StandardUsernameListBoxModel().withMatching(SSHAuthenticator.matcher(Connection.class),
                    CredentialsProvider.lookupCredentials(StandardUsernameCredentials.class, context,
                        ACL.SYSTEM, SSHLauncher.SSH_SCHEME));
        }

        public ListBoxModel doFillRetentionStrategyNameItems() {
            ListBoxModel model = new ListBoxModel();

            model.add(Constants.RETENTION_STRATEGY_ONCE);
            model.add(Constants.RETENTION_STRATEGY_DEMAND);

            return model;
        }

        public FormValidation doCheckCustomJsonOpts(@QueryParameter String value) throws IOException, ServletException {
            String val = Util.fixEmptyAndTrim(value);
            if (val == null)
                return FormValidation.ok();

            try {
                JSONObject.fromObject(val);
                return FormValidation.ok();
            } catch (JSONException e) {
                return FormValidation.error("Not valid JSON");
            }
        }

        public FormValidation doCheckIdleTerminationMinutes(@QueryParameter String value) {
            try {
                Integer mins = Integer.parseInt(value);
                if (mins < 0)
                    return FormValidation.error("Must not be negative");
                else if (mins == 0)
                    return FormValidation.error("Must not be zero");
                else
                    return FormValidation.ok();
            } catch (NumberFormatException e) {
                return FormValidation.error("Not a number");
            }
        }
    }
}

