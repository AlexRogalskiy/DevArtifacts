package com.ryancarrigan.jenkins.data.jenkins.job;

import com.ryancarrigan.jenkins.data.JenkinsXMLFile;
import com.ryancarrigan.jenkins.data.jenkins.build.Build;
import org.jdom2.Element;

/**
 * Created by Suave Peanut on 2014.5.23.
 */
public class JobBuild extends JenkinsXMLFile {

    private Integer number;
    private String url;

    public JobBuild(final Element build) {
        super(build, "build", "firstBuild", "lastBuild", "lastCompletedBuild", "lastStableBuild", "lastSuccessfulBuild",
                "lastSuccessfulBuild", "lastUnstableBuild", "lastUnsuccessfulBuild");
        this.number = Integer.valueOf(build.getChildText("number"));
        this.url = build.getChildText("url");
    }

    public Build getBuild() {
        return new Build(getDocument(url));
    }

    public Integer getNumber() {
        return number;
    }

    public String getUrl() {
        return url;
    }
}
