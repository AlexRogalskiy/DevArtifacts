package com.ryancarrigan.jenkins.data.jenkins.view;

import com.ryancarrigan.jenkins.data.JenkinsXMLFile;
import com.ryancarrigan.jenkins.data.jenkins.job.Job;
import org.jdom2.Document;
import org.jdom2.Element;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Suave Peanut on 5/22/14.
 */
public class View extends JenkinsXMLFile {
    private final String description;
    private final List<ViewJob> jobs;

    public View(final Document document) {
        super(document, "listView");
        this.description = root.getChildText("description");
        this.jobs = getJobList();
    }

    private List<ViewJob> getJobList() {
        final List<ViewJob> jobs = new ArrayList<>();
        for (final Element job : root.getChildren("job")) {
            jobs.add(new ViewJob(job));
        }
        return jobs;
    }

    public String getDescription() {
        return description;
    }

    public List<ViewJob> getJobs() {
        return jobs;
    }

    public Job getFirstJob() {
        return getJob(0);
    }

    public Job getJob(final Integer jobNumber) {
        return new Job(getDocument(jobs.get(jobNumber).getUrl()));
    }

    public Job getJob(final String jobName) {
        for (final ViewJob job : jobs) {
            if (job.getName().equals(jobName))
                return new Job(getDocument(job.getUrl()));
        }
        return getFirstJob();
    }
}
