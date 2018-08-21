package org.jazzteam.jenkinstest;

import org.jazzteam.jenkinstest.logic.ModelBuilder;
import org.jazzteam.jenkinstest.models.JenkinsModel;
import org.jazzteam.jenkinstest.models.JobModel;
import org.testng.Assert;
import org.testng.annotations.Test;

public class JenkinsTest {

    @Test
    public void createNewJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        int responseCode = jobModel.createJob();
        Assert.assertEquals(responseCode, 200, "Wrong status! 200 expected, but got" + responseCode);
    }

    @Test
    public void createExistingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        int responseCode = jobModel.createJob();
        Assert.assertEquals(responseCode, 400, "Wrong status! 400 expected, but got" + responseCode);
    }

    @Test
    public void deleteExistingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        int responseCode = jobModel.deleteJob();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }

    @Test
    public void enableExistingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        int responseCode = jobModel.enableJob();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }

    @Test
    public void enableEnabledJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        jobModel.enableJob();
        int responseCode = jobModel.enableJob();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }

    @Test
    public void enableMissingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        int responseCode = jobModel.enableJob();
        Assert.assertEquals(responseCode, 404, "Wrong status! 404 expected, but got" + responseCode);
    }

    @Test
    public void disableEnabledJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        jobModel.enableJob();
        int responseCode = jobModel.disableJob();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }

    @Test
    public void disableMissingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        int responseCode = jobModel.disableJob();
        Assert.assertEquals(responseCode, 404, "Wrong status! 404 expected, but got" + responseCode);
    }

    @Test
    public void disableDisabledJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        jobModel.disableJob();
        int responseCode = jobModel.disableJob();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }

    @Test
    public void getExistingJobDescription(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        int responseCode = jobModel.getJobDescription();
        Assert.assertEquals(responseCode, 200, "Wrong status! 200 expected, but got" + responseCode);
    }

    @Test
    public void postNewDescriptionToExistingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        int responseCode = jobModel.updateJobDescription();
        Assert.assertEquals(responseCode, 200, "Wrong status! 200 expected, but got" + responseCode);
    }

    @Test
    public void postNewDescriptionToMissingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        int responseCode = jobModel.updateJobDescription();
        Assert.assertEquals(responseCode, 404, "Wrong status! 404 expected, but got" + responseCode);
    }

    @Test
    public void getMissingJobDescription(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        int responseCode = jobModel.getJobDescription();
        Assert.assertEquals(responseCode, 404, "Wrong status! 404 expected, but got" + responseCode);
    }

    @Test
    public void buildExistingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        int responseCode = jobModel.buildJob();
        Assert.assertEquals(responseCode, 201, "Wrong status! 201 expected, but got" + responseCode);
    }

    @Test
    public void buildMissingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        int responseCode = jobModel.buildJob();
        Assert.assertEquals(responseCode, 404, "Wrong status! 404 expected, but got" + responseCode);
    }

    @Test
    public void getExistingJobConfig(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        jobModel.createJob();
        int responseCode = jobModel.getJobConfig();
        Assert.assertEquals(responseCode, 200, "Wrong status! 200 expected, but got" + responseCode);
    }

    @Test
    public void getMissingJobConfig(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.deleteJob();
        int responseCode = jobModel.getJobConfig();
        Assert.assertEquals(responseCode, 404, "Wrong status! 404 expected, but got" + responseCode);
    }

    @Test
    public void copyExistingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.clear();
        jobModel.createJob();
        int responseCode = jobModel.copyJob();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }

    @Test
    public void copyMissingJob(){
        JobModel jobModel = new ModelBuilder().getJobModel();
        jobModel.clear();
        int responseCode = jobModel.copyJob();
        Assert.assertEquals(responseCode, 400, "Wrong status! 400 expected, but got" + responseCode);
    }

    @Test
    public void quiteDownJenkins(){
        JenkinsModel jenkinsModel = new ModelBuilder().getJenkinsModel();
        jenkinsModel.jenkinsCancelQuietDown();
        int responseCode = jenkinsModel.jenkinsQuietDown();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }

    @Test
    public void cancelQuiteDownJenkins(){
        JenkinsModel jenkinsModel = new ModelBuilder().getJenkinsModel();
        jenkinsModel.jenkinsQuietDown();
        int responseCode = jenkinsModel.jenkinsCancelQuietDown();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }

    @Test
    public void restartJenkins(){
        JenkinsModel jenkinsModel = new ModelBuilder().getJenkinsModel();
        int responseCode = jenkinsModel.jenkinsRestart();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }

    @Test
    public void safeRestartJenkins(){
        JenkinsModel jenkinsModel = new ModelBuilder().getJenkinsModel();
        int responseCode = jenkinsModel.jenkinsSafeRestart();
        Assert.assertEquals(responseCode, 302, "Wrong status! 302 expected, but got" + responseCode);
    }
}
