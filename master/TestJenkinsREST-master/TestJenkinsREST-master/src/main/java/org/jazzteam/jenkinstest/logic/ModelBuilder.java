package org.jazzteam.jenkinstest.logic;

import org.jazzteam.jenkinstest.models.JenkinsModel;
import org.jazzteam.jenkinstest.models.JobModel;

public class ModelBuilder {

    public JobModel getJobModel(){
        return new JobModel();
    }

    public JenkinsModel getJenkinsModel(){
        return new JenkinsModel();
    }
}
