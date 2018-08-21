package com.ryancarrigan.jenkins.data.jenkins.home;

import com.ryancarrigan.jenkins.data.JenkinsXMLFile;
import com.ryancarrigan.jenkins.data.jenkins.job.Job;
import com.ryancarrigan.jenkins.data.jenkins.view.View;
import org.jdom2.Document;
import org.jdom2.Element;

import java.util.ArrayList;
import java.util.List;

/**
 * com.ryancarrigan.jenkins.data.jenkins
 *
 * @author Ryan P. Carrigan
 * @since 5/23/14.
 */
public class Home extends JenkinsXMLFile {
    private final Boolean quietingDown;
    private final Boolean useCrumbs;
    private final Boolean useSecurity;
    private final Integer numExecutors;
    private final Integer slaveAgentPort;
    private final List<Job> jobs;
    private final List<HomeView> views;
    private final String assignedLabel;
    private final String mode;
    private final String nodeDescription;
    private final String nodeName;
    private final String unlabeledLoad;
    private final HomeView primaryView;

    public Home(final Document xmlFile) {
        super(xmlFile, "hudson");
        this.quietingDown = Boolean.valueOf(root.getChildText("quietingDown"));
        this.useCrumbs = Boolean.valueOf(root.getChildText("useCrumbs"));
        this.useSecurity = Boolean.valueOf(root.getChildText("useSecurity"));
        this.numExecutors = Integer.valueOf(root.getChildText("numExecutors"));
        this.slaveAgentPort = Integer.valueOf(root.getChildText("slaveAgentPort"));
        this.jobs = getJobList();
        this.views = getViewList();
        this.assignedLabel = root.getChildText("assignedLabel");
        this.mode = root.getChildText("mode");
        this.nodeDescription = root.getChildText("nodeDescription");
        this.nodeName = root.getChildText("nodeName");
        this.unlabeledLoad = root.getChildText("unlabeledLoad");
        this.primaryView = new HomeView(root.getChild("primaryView"));
    }

    public View getFirstView() {
        return getView(1);
    }

    public View getView(final Integer viewNumber) {
        return new View(getDocument(views.get(viewNumber).getUrl()));
    }

    public View getView(final String viewName) {
        for (final HomeView view : views) {
            if (view.getName().equals(viewName))
                return new View(getDocument(view.getUrl()));
        }
        return null;
    }

    private List<Job> getJobList() {
        return new ArrayList<>();
    }

    private List<HomeView> getViewList() {
        final List<HomeView> viewList = new ArrayList<>();
        for (final Element view : root.getChildren("view")) {
            viewList.add(new HomeView(view));
        }
        return viewList;
    }

    public Boolean getQuietingDown() {
        return quietingDown;
    }

    public Boolean getUseCrumbs() {
        return useCrumbs;
    }

    public Boolean getUseSecurity() {
        return useSecurity;
    }

    public Integer getNumExecutors() {
        return numExecutors;
    }

    public Integer getSlaveAgentPort() {
        return slaveAgentPort;
    }

    public List<Job> getJobs() {
        return jobs;
    }

    public List<HomeView> getViews() {
        return views;
    }

    public String getAssignedLabel() {
        return assignedLabel;
    }

    public String getMode() {
        return mode;
    }

    public String getNodeDescription() {
        return nodeDescription;
    }

    public String getNodeName() {
        return nodeName;
    }

    public String getUnlabeledLoad() {
        return unlabeledLoad;
    }

    public HomeView getPrimaryView() {
        return primaryView;
    }
}
