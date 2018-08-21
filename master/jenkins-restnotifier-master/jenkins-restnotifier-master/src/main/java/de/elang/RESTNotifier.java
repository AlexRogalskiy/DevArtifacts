package de.elang;

import hudson.Extension;
import hudson.Launcher;
import hudson.model.BuildListener;
import hudson.model.Result;
import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.BuildStepMonitor;
import hudson.tasks.Notifier;
import hudson.tasks.Publisher;

import java.io.IOException;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;

public class RESTNotifier extends Notifier {
    private static final Logger LOGGER = Logger.getLogger(RESTNotifier.class);
    public final String successURL;
    public final String unstableURL;
    public final String failedURL;
    public final String abortedURL;
    public final String startedURL;
    public final boolean includePreviousState;
    private Client httpClient;

    @DataBoundConstructor
    public RESTNotifier(final String successURL, final String unstableURL, final String failedURL,
            final String abortedURL, final String startedURL, final boolean includePreviousState) {
        super();
        this.successURL = successURL;
        this.unstableURL = unstableURL;
        this.failedURL = failedURL;
        this.abortedURL = abortedURL;
        this.startedURL = startedURL;
        this.includePreviousState = includePreviousState;
        httpClient = Client.create();
        httpClient.setReadTimeout(3000);
    }

    public BuildStepMonitor getRequiredMonitorService() {
        return BuildStepMonitor.BUILD;
    }

    @Override
    public boolean prebuild(AbstractBuild <?, ?> build, BuildListener listener) {
        WebResource resource = httpClient.resource(startedURL);
        if (build.getPreviousBuild() != null && includePreviousState) {
            String resultOfPreviousBuild = obtainBuildResultParam(build);
            System.out.println(resultOfPreviousBuild);
            resource = resource.queryParam("previous", resultOfPreviousBuild);
        }
        try {
            resource.get(String.class);
        } catch (ClientHandlerException e) {
            LOGGER.warn("Could not notify to URL: " + startedURL, e);
        } catch (UniformInterfaceException e) {
            LOGGER.warn("Could not notify to URL: " + startedURL, e);
        }
        return true;
    }

    private String obtainBuildResultParam(AbstractBuild <?, ?> build) {
        Result previousResult = build.getPreviousBuild().getResult();
        if (Result.SUCCESS.equals(previousResult)) {
            return "SUCCESS";
        }
        if (Result.ABORTED.equals(previousResult)) {
            return "ABORTED";
        }
        if (Result.FAILURE.equals(previousResult)) {
            return "FAILURE";
        }
        if (Result.UNSTABLE.equals(previousResult)) {
            return "UNSTABLE";
        } else {
            return "NOT_BUILT";
        }
    }

    @Override
    public boolean perform(AbstractBuild <?, ?> build, Launcher launcher, BuildListener listener)
            throws InterruptedException, IOException {

        String connectURL = "";
        if (Result.FAILURE.equals(build.getResult())) {
            connectURL = failedURL;
        } else if (Result.UNSTABLE.equals(build.getResult())) {
            connectURL = unstableURL;
        } else if (Result.SUCCESS.equals(build.getResult())) {
            connectURL = successURL;
        } else if (Result.ABORTED.equals(build.getResult())) {
            connectURL = abortedURL;
        }
        try {
            httpClient.resource(connectURL).get(String.class);
        } catch (ClientHandlerException e) {
            LOGGER.warn("Could not notify to URL: " + connectURL);
        }
        return true;
    }

    @Override
    public DescriptorImpl getDescriptor() {
        return (DescriptorImpl) super.getDescriptor();
    }

    @Extension
    public static class DescriptorImpl extends BuildStepDescriptor <Publisher> {
        public DescriptorImpl() {
            super(RESTNotifier.class);
            load();
        }

        @Override
        public boolean configure(StaplerRequest req, JSONObject json) throws hudson.model.Descriptor.FormException {
            return super.configure(req, json);
        }

        @Override
        public boolean isApplicable(Class <? extends AbstractProject> arg0) {
            return true;
        }

        @Override
        public String getDisplayName() {
            return "REST Notifier";
        }
    }

}
