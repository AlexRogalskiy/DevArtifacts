package com.ryancarrigan.jenkins.data.jenkins.job;

import com.ryancarrigan.jenkins.data.JenkinsXMLFile;
import com.ryancarrigan.jenkins.data.jenkins.build.Build;
import com.ryancarrigan.jenkins.download.FileDownloader;
import org.jdom2.Document;
import org.jdom2.Element;

import java.util.ArrayList;
import java.util.List;

/**
 * com.ryancarrigan.jenkins.data.parsing
 *
 * @author Ryan P. Carrigan
 * @since 5/22/14.
 */
public class Job extends JenkinsXMLFile {
    private final Boolean buildable;
    private final Boolean concurrentBuild;
    private final Boolean inQueue;
    private final Boolean keepDependencies;
    private final Integer nextBuildNumber;
    private final JobBuild firstBuild;
    private final JobBuild lastBuild;
    private final JobBuild lastCompletedBuild;
    private final JobBuild lastStableBuild;
    private final JobBuild lastSuccessfulBuild;
    private final JobBuild lastUnstableBuild;
    private final JobBuild lastUnsuccessfulBuild;
    private final List<HealthReport> healthReports;
    private final List<JobBuild> builds;
    private final List<Module> modules;
    private final String color;
    private final String displayName;
    private final String name;
    private final String url;

    public Job(final Document document) {
        super(document, "mavenModuleSet");
        this.buildable = Boolean.valueOf(root.getChildText("buildable"));
        this.concurrentBuild = Boolean.valueOf(root.getChildText("concurrentBuild"));
        this.inQueue = Boolean.valueOf(root.getChildText("inQueue"));
        this.keepDependencies = Boolean.valueOf(root.getChildText("keepDependencies"));
        this.firstBuild = getJobBuild(root.getChild("firstBuild"));
        this.lastBuild = getJobBuild(root.getChild("lastBuild"));
        this.lastCompletedBuild = getJobBuild(root.getChild("lastCompletedBuild"));
        this.lastStableBuild = getJobBuild(root.getChild("lastStableBuild"));
        this.lastSuccessfulBuild = getJobBuild(root.getChild("lastSuccessfulBuild"));
        this.lastUnstableBuild = getJobBuild(root.getChild("lastUnstableBuild"));
        this.lastUnsuccessfulBuild = getJobBuild(root.getChild("lastUnsuccessfulBuild"));
        this.nextBuildNumber = Integer.valueOf(root.getChildText("nextBuildNumber"));
        this.builds = getBuildList(root);
        this.healthReports = getHealthReportList(root);
        this.modules = getModuleList(root);
        this.color = root.getChildText("color");
        this.displayName = root.getChildText("displayName");
        this.name = root.getChildText("name");
        this.url = root.getChildText("url");
    }

    @Override
    public String toString() {
        return String.format("%s (%s)", displayName, name);
    }

    public Boolean getBuildable() {
        return buildable;
    }

    public Boolean getConcurrentBuild() {
        return concurrentBuild;
    }

    public Boolean getInQueue() {
        return inQueue;
    }

    public Boolean getKeepDependencies() {
        return keepDependencies;
    }

    public Build getFirstBuild() {
        return getBuild(firstBuild);
    }

    public Build getLastBuild() {
        return getBuild(lastBuild);
    }

    public Build getLastCompletedBuild() {
        return getBuild(lastCompletedBuild);
    }

    public Build getLastStableBuild() {
        return getBuild(lastStableBuild);
    }

    public Build getLastSuccessfulBuild() {
        return getBuild(lastSuccessfulBuild);
    }

    public Build getLastUnstableBuild() {
        return getBuild(lastUnstableBuild);
    }

    public Build getLastUnsuccessfulBuild() {
        return getBuild(lastUnsuccessfulBuild);
    }

    public Integer getNextBuildNumber() {
        return nextBuildNumber;
    }

    public List<JobBuild> getBuilds() {
        return builds;
    }

    public List<HealthReport> getHealthReports() {
        return healthReports;
    }

    public List<Module> getModules() {
        return modules;
    }

    public String getColor() {
        return color;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getName() {
        return name;
    }

    public String getUrl() {
        return url;
    }

    private Build getBuild(final JobBuild jobBuild) {
        final Document document = new FileDownloader(jobBuild.getUrl()).getDocument();
        return new Build(document);
    }

    private JobBuild getJobBuild(final Element build) {
        if (null != build)
            return new JobBuild(build);
        return null;
    }

    private List<JobBuild> getBuildList(final Element root) {
        final List<JobBuild> builds = new ArrayList<>();
        for (final Element build : root.getChildren("build")) {
            builds.add(getJobBuild(build));
        }
        return builds;
    }

    private List<HealthReport> getHealthReportList(final Element root) {
        final List<HealthReport> healthReports = new ArrayList<>();
        for (final Element healthReport : root.getChildren("healthReport")) {
            healthReports.add(new HealthReport(healthReport));
        }
        return healthReports;
    }

    private List<Module> getModuleList(final Element root) {
        final List<Module> modules = new ArrayList<>();
        for (final Element module : root.getChildren("module")) {
            modules.add(new Module(module));
        }
        return modules;
    }

}
