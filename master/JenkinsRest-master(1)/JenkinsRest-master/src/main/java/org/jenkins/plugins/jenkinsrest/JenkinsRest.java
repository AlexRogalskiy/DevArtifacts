package org.jenkins.plugins.jenkinsrest;

import java.io.IOException;
import java.util.logging.Logger;

import hudson.DescriptorExtensionList;
import hudson.model.Descriptor;
import hudson.util.DescribableList;
import jenkins.model.Jenkins;
import net.sf.json.JSONObject;

import org.kohsuke.stapler.StaplerRequest;

import hudson.Plugin;

public class JenkinsRest extends Plugin {
	public final static Logger LOG = Logger.getLogger(JenkinsRest.class.getName());

    // the list of global notifiers currently in existence
    public DescribableList<RestNotifier, Descriptor<RestNotifier>> restNotifiers =
            new DescribableList<RestNotifier, Descriptor<RestNotifier>>(this);

	public void start() throws IOException {
		load();
	}

    protected static JenkinsRest _instance;

    public static DescribableList<RestNotifier, Descriptor<RestNotifier>> getRestNotifiers() {
        return Jenkins.getInstance().getPlugin(JenkinsRest.class).restNotifiers;
    }

    public static DescriptorExtensionList<RestNotifier, Descriptor<RestNotifier>> getNotifierClasses() {
        return Jenkins.getInstance().getDescriptorList(RestNotifier.class);
    }

	@Override
	public void configure(StaplerRequest req, JSONObject formData) throws IOException, Descriptor.FormException {
        try {
            restNotifiers.rebuildHetero(req, formData, getNotifierClasses(), "notifiers");
            save();
        } catch (IOException e) {
            throw new Descriptor.FormException(e, "notifiers");
        }
	}

    public static void notifyStatic(Event e) {
        if (_instance != null) {
            _instance.notify();
        }
    }

    public void notify(Event e) {
        for (RestNotifier restNotifier : restNotifiers) {
            restNotifier.notify(e);
        }
    }
}
