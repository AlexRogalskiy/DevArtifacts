package com.phase2technology.jenkins;

import hudson.model.AbstractBuild;
import hudson.model.BuildBadgeAction;
import hudson.model.Hudson;
import hudson.model.Run;


/**
 * {@link Action} for {@link AbstractBuild} marking it so that visibility
 * can be noted in the build history widget 
 *
 * @author Chris Johnson
 */
public final class BuildVisibilityAction implements BuildBadgeAction {
	private AbstractBuild<?,?> owner = null;
	
	public BuildVisibilityAction(AbstractBuild<?,?> ab) {
		assert ab != null;
		this.owner = ab;
	}

	public String getDisplayName() {
		return null;
	}

	public String getIconFileName() {
		return null;
	}

	public String getUrlName() {
		return null;
	}
 
	public boolean isVisible() {
		boolean visible = false;
		if (this.owner != null && this.owner instanceof Run) {
			RestrictedBuildVisibilityMatrixAuthorizationStrategy s = new RestrictedBuildVisibilityMatrixAuthorizationStrategy();
			visible = s.viewableByCurrentUser((Run) this.owner);
		}
		return visible;
	}
	
	public String getIcon(String size) {
		return Hudson.RESOURCE_PATH + "/images/" + size + "/" + (isVisible() ? "orange-square.png" : "edit-delete.png");
	}
	
	public String getText() {
		return isVisible() ? "Visible" : "Access Restricted";
	}
}