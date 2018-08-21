package com.phase2technology.jenkins;

import hudson.tasks.BuildStepMonitor;
import hudson.tasks.Recorder;
import hudson.tasks.Publisher;
import hudson.Extension;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.kohsuke.stapler.DataBoundConstructor;

import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import hudson.model.Cause;
import hudson.model.Hudson;
import hudson.model.Job;
import hudson.model.Run;
import hudson.Launcher;
import hudson.model.BuildListener;
import hudson.model.Cause.UpstreamCause;
import hudson.tasks.BuildStepDescriptor;

public class BuildVisibilityPublisher extends Recorder {

	public BuildStepMonitor getRequiredMonitorService() {
		return BuildStepMonitor.NONE;
	}
	
	@DataBoundConstructor
	public BuildVisibilityPublisher() {
	}

	@Override
	public boolean perform(final AbstractBuild<?, ?> ab, final Launcher launcher, final BuildListener listener) throws InterruptedException, IOException {
		Logger l = Logger.getLogger(BuildVisibilityPublisher.class.getName());

		List<Cause> causes  = ab.getCauses();
		for(Cause c : causes) {
			if (c instanceof UpstreamCause) {
				int buildId = ((UpstreamCause) c).getUpstreamBuild();
				String jobName = ((UpstreamCause) c).getUpstreamProject();
				Job<?,?> j = Hudson.getInstance().getItemByFullName(jobName, hudson.model.Job.class);
				Run r = (j == null) ? null : j.getBuildByNumber(buildId);
				if (r != null) {
					l.log(Level.FINER, "Add badge action to upstream " + jobName + " " + buildId);
					r.addAction(new BuildVisibilityAction(ab));
				}
			}
		}
		l.log(Level.FINER, "Add badge action to " + ab.getDisplayName());
		ab.addAction(new BuildVisibilityAction(ab));
		
		return true;
	}

	@Extension
	public static final class BuildVisibilityPublisherDescriptor extends BuildStepDescriptor<Publisher> {
		public BuildVisibilityPublisherDescriptor() {
			super(BuildVisibilityPublisher.class);
		}

		@Override
		public String getDisplayName() {
			return "Build Visibility";
		}

		@Override
		public boolean isApplicable(Class<? extends AbstractProject> jobType) {
			return true;
		}
	}
}
