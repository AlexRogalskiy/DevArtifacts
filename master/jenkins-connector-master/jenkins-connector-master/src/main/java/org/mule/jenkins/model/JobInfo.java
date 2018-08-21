/**
 *
 * Copyright (c) MuleSoft, Inc.  All rights reserved.  http://www.mulesoft.com
 *
 * The software in this package is published under the terms of the CPAL v1.0
 * license, a copy of which has been included with this distribution in the
 * LICENSE.txt file.
 */

package org.mule.jenkins.model;

import java.io.Serializable;

public class JobInfo implements Serializable {
    private Object[] actions;
    private String description;
    private String displayName;
    private String name;
    private String url;
    private String buildable;
    private Build[] builds;
    private String color;
    private Build firstBuild;
    private HealtReport[] healthReport;
    private boolean inQueue;
    private boolean keepDependencies;
    private Build lastBuild;
    private Build lastCompletedBuild;
    private Build lastFailedBuild;
    private Build lastStableBuild;
    private Build lastSuccessfulBuild;
    private Build lastUnstableBuild;
    private Build lastUnsuccessfulBuild;
    private int nextBuildNumber;
    private Object[] property;
    private Build queueItem;
    private boolean concurrentBuild;
    private Project downstreamProjects[];
    private Project scm;
    private Project[] upstreamProjects;
    private Module[] modules;

    public Object[] getActions() {
        return actions;
    }

    public void setActions(Object[] actions) {
        this.actions = actions;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getBuildable() {
        return buildable;
    }

    public void setBuildable(String buildable) {
        this.buildable = buildable;
    }

    public Build[] getBuilds() {
        return builds;
    }

    public void setBuilds(Build[] builds) {
        this.builds = builds;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Build getFirstBuild() {
        return firstBuild;
    }

    public void setFirstBuild(Build firstBuild) {
        this.firstBuild = firstBuild;
    }

    public HealtReport[] getHealthReport() {
        return healthReport;
    }

    public void setHealthReport(HealtReport[] healthReport) {
        this.healthReport = healthReport;
    }

    public boolean isInQueue() {
        return inQueue;
    }

    public void setInQueue(boolean inQueue) {
        this.inQueue = inQueue;
    }

    public boolean isKeepDependencies() {
        return keepDependencies;
    }

    public void setKeepDependencies(boolean keepDependencies) {
        this.keepDependencies = keepDependencies;
    }

    public Build getLastBuild() {
        return lastBuild;
    }

    public void setLastBuild(Build lastBuild) {
        this.lastBuild = lastBuild;
    }

    public Build getLastCompletedBuild() {
        return lastCompletedBuild;
    }

    public void setLastCompletedBuild(Build lastCompletedBuild) {
        this.lastCompletedBuild = lastCompletedBuild;
    }

    public Build getLastFailedBuild() {
        return lastFailedBuild;
    }

    public void setLastFailedBuild(Build lastFailedBuild) {
        this.lastFailedBuild = lastFailedBuild;
    }

    public Build getLastStableBuild() {
        return lastStableBuild;
    }

    public void setLastStableBuild(Build lastStableBuild) {
        this.lastStableBuild = lastStableBuild;
    }

    public Build getLastSuccessfulBuild() {
        return lastSuccessfulBuild;
    }

    public void setLastSuccessfulBuild(Build lastSuccessfulBuild) {
        this.lastSuccessfulBuild = lastSuccessfulBuild;
    }

    public Build getLastUnstableBuild() {
        return lastUnstableBuild;
    }

    public void setLastUnstableBuild(Build lastUnstableBuild) {
        this.lastUnstableBuild = lastUnstableBuild;
    }

    public Build getLastUnsuccessfulBuild() {
        return lastUnsuccessfulBuild;
    }

    public void setLastUnsuccessfulBuild(Build lastUnsuccessfulBuild) {
        this.lastUnsuccessfulBuild = lastUnsuccessfulBuild;
    }

    public int getNextBuildNumber() {
        return nextBuildNumber;
    }

    public void setNextBuildNumber(int nextBuildNumber) {
        this.nextBuildNumber = nextBuildNumber;
    }

    public Object[] getProperty() {
        return property;
    }

    public void setProperty(Object[] property) {
        this.property = property;
    }

    public Build getQueueItem() {
        return queueItem;
    }

    public void setQueueItem(Build queueItem) {
        this.queueItem = queueItem;
    }

    public boolean isConcurrentBuild() {
        return concurrentBuild;
    }

    public void setConcurrentBuild(boolean concurrentBuild) {
        this.concurrentBuild = concurrentBuild;
    }

    public Project[] getDownstreamProjects() {
        return downstreamProjects;
    }

    public void setDownstreamProjects(Project[] downstreamProjects) {
        this.downstreamProjects = downstreamProjects;
    }

    public Project getScm() {
        return scm;
    }

    public void setScm(Project scm) {
        this.scm = scm;
    }

    public Project[] getUpstreamProjects() {
        return upstreamProjects;
    }

    public void setUpstreamProjects(Project[] upstreamProjects) {
        this.upstreamProjects = upstreamProjects;
    }

    public Module[] getModules() {
        return modules;
    }

    public void setModules(Module[] modules) {
        this.modules = modules;
    }
}
