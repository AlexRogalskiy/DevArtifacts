package com.ryancarrigan.jenkins.data.jenkins.home;

import com.ryancarrigan.jenkins.data.JenkinsXMLFile;
import com.ryancarrigan.jenkins.data.jenkins.job.Job;
import org.jdom2.Element;

/**
 * Created by Suave Peanut on 2014.5.23.
 */
public class HomeJob extends JenkinsXMLFile {
    private final String name;
    private final String url;

    public HomeJob(final Element view) {
        super(view, "job");
        this.name =  root.getChildText("name");
        this.url = root.getChildText("url");
    }

    public String getName() {
        return name;
    }

    public String getUrl() {
        return url;
    }

    public Job getJob() {
        return new Job(getDocument(url));
    }

    @Override
    public String toString() {
        return String.format("%s [%s]", name, url);
    }
}
