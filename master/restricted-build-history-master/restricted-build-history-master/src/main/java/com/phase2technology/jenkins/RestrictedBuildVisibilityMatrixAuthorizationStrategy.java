package com.phase2technology.jenkins;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.kohsuke.stapler.Stapler;

import hudson.model.Hudson;

import com.thoughtworks.xstream.converters.UnmarshallingContext;
import com.thoughtworks.xstream.core.JVM;
import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.mapper.Mapper;

import hudson.Extension;
import hudson.model.Cause;
import hudson.model.Descriptor;
import hudson.model.Job;
import hudson.model.Run;
import hudson.model.Cause.UpstreamCause;
import hudson.model.Cause.UserIdCause;
import hudson.security.AuthorizationStrategy;
import hudson.security.GlobalMatrixAuthorizationStrategy;
import hudson.security.ProjectMatrixAuthorizationStrategy;
import hudson.security.Permission;
import hudson.util.RobustReflectionConverter;

public class RestrictedBuildVisibilityMatrixAuthorizationStrategy extends ProjectMatrixAuthorizationStrategy {
	// since determining whether a user has permission will require loading objects that trigger the
	// hasPermission check this is used to prevent infinite recursion
	private boolean checkingPermission = false;

	/**
	 * For this authorization strategy we want to deny access to runs that a user did not start
	 * unless the user is an administrator. To do this, permission to the job owning the run must
	 * be denied but we want to do so only if someone is looking at a run (otherwise they need to
	 * see the job in order to start new builds)
	 * 
	 * Anyone can see runs started by an anonymous user
	 * 
	 * When it is determined access is ok, the access is then determined via normal access checks
	 */
	@Override
	public boolean hasPermission(String sid, Permission p) {
		boolean allowed = true;
		Logger l = Logger.getLogger(RestrictedBuildVisibilityMatrixAuthorizationStrategy.class.getName());
		
		if (p != null && this.checkingPermission != true && !p.equals(Hudson.ADMINISTER)) {
			String currentUserId = Hudson.getAuthentication().getName();
			String jobName = null;
			String buildId = null;
			String[] urlparts = Stapler.getCurrentRequest().getRequestURI().split("/");

			// determine if someone is trying to look at one of the build history URLs
			for (int i = 0; i < urlparts.length - 2; ++i) {
				if (urlparts[i].equals("job")) {
					try {
					jobName = java.net.URLDecoder.decode(urlparts[i + 1], "UTF-8");
					}
					catch (UnsupportedEncodingException e) {
						// just save it without decoding, hopefully we can load up the job later
						// but if we fail we'll default to denying access
						jobName = urlparts[i + 1];
					}
					buildId = urlparts[i + 2];
					if (buildId.indexOf("label=") != -1) {
						buildId = (urlparts.length > (i + 3)) ? urlparts[i + 3] : buildId;
					}
					break;
				}
			}
			
			if (jobName != null && buildId != null) {
				l.log(Level.FINE, "Checking access to job: " + jobName + " build: " + buildId + " for user: " + currentUserId);
				// if we have a job and a build, default to not allowing access
				// so that if something goes awry during the check we fail to disallow
				allowed = false;
				this.checkingPermission = true;
				try {
					l.log(Level.FINEST, "Loading job " + jobName);
					Job<?,?> j = Hudson.getInstance().getItemByFullName(jobName, hudson.model.Job.class);
					if (j == null) {
						l.log(Level.WARNING, "Could not load job to determine permissions: " + jobName);
					}
					else {
						l.log(Level.FINEST, "Loading run " + buildId);
						Run<?,?> r = null;
						try {
							int i = Integer.parseInt(buildId);
							r = j.getBuildByNumber(i);
						}
						catch (NumberFormatException nfe) {
							if (buildId.equalsIgnoreCase("lastBuild")) {
								r = j.getLastBuild();
							}
							else if (buildId.equalsIgnoreCase("lastStableBuild")) {
								r = j.getLastStableBuild();
							}
							else {
								// must be requesting a new build or other data, let the parent handle access
								allowed = true;
							}
						}
	
						if (r != null) {
							allowed = viewableByCurrentUser(r);
						}
						else if (!allowed){
							l.log(Level.WARNING, "Could not load run " + buildId + " to determine permission, defaulting to disallow");
						}
					}
				} catch (Exception e) {
					l.log(Level.SEVERE, e.getClass().getName());
					l.log(Level.SEVERE, e.getMessage());
				}
				this.checkingPermission = false;
			}
		}

		if (allowed) {
			l.log(Level.FINER, "Access determined by normal access control");
			allowed = super.hasPermission(sid, p);
		}
		l.log(Level.FINE, "Access allowed: " + (allowed ? "yes" : "no"));
		return allowed;
	}
	
	/*
	 *  A run is viewable if the current user is an admin, the run was started by the anonymous user,
	 *  the run was started by the current user or the run was the result of an upstream run visible 
	 *  using the same criteria
	 */
	public boolean viewableByCurrentUser(Run<?, ?> r) {
		Logger l = Logger.getLogger(RestrictedBuildVisibilityMatrixAuthorizationStrategy.class.getName());
		String currentUserId = Hudson.getAuthentication().getName();
		boolean viewable = false;

		if (Hudson.getInstance().getACL().hasPermission(Hudson.ADMINISTER)) {
			viewable = true;
		}
		else if (r != null) {
			List<Cause> cs = r.getCauses();
			for (Cause c : cs) {
				if (c instanceof UserIdCause) {
					String startingUserId = ((UserIdCause) c).getUserId();
					viewable = (startingUserId != null && startingUserId.equalsIgnoreCase(currentUserId)) || (startingUserId == null);
					l.log(Level.FINER, "Run " + r.number + " started by: " + ((startingUserId != null) ? startingUserId : "anonymous"));
					break;
				}
				else if (c instanceof UpstreamCause) {
					l.log(Level.FINER, "Have to check upstream for permission");
					// whether you can see it depends on whether you can see the upstream Run
					int buildId = ((UpstreamCause) c).getUpstreamBuild();
					String jobName = ((UpstreamCause) c).getUpstreamProject();
					Job<?,?> j = Hudson.getInstance().getItemByFullName(jobName, hudson.model.Job.class);
					Run ur = (j == null) ? null : j.getBuildByNumber(buildId);
					viewable = viewableByCurrentUser(ur);
					break;
				}
			}
		}
		return viewable;
	}

	@Extension
	public static final Descriptor<AuthorizationStrategy> DESCRIPTOR = new DescriptorImpl() {
		@Override
		protected GlobalMatrixAuthorizationStrategy create() {
			return new RestrictedBuildVisibilityMatrixAuthorizationStrategy();
		}

		@Override
		public String getDisplayName() {
			return "Restricted Build Visibility Matrix Authorization Strategy";
		}
	};

	public static class ConverterImpl extends
			GlobalMatrixAuthorizationStrategy.ConverterImpl {
		private RobustReflectionConverter ref;

		public ConverterImpl(Mapper m) {
			ref = new RobustReflectionConverter(m, new JVM().bestReflectionProvider());
		}

		@Override
		protected GlobalMatrixAuthorizationStrategy create() {
			return new RestrictedBuildVisibilityMatrixAuthorizationStrategy();
		}

		@Override
		public Object unmarshal(HierarchicalStreamReader reader,
				UnmarshallingContext context) {
			String name = reader.peekNextChild();
			if (name != null && (name.equals("permission") || name.equals("useProjectSecurity")))
				// the proper serialization form
				return super.unmarshal(reader, context);
			else
				// remain compatible with earlier problem where we used
				// reflection converter
				return ref.unmarshal(reader, context);
		}

		@Override
		public boolean canConvert(Class type) {
			return type == RestrictedBuildVisibilityMatrixAuthorizationStrategy.class;
		}
	}
}
