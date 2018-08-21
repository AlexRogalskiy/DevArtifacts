package org.jazzteam.jenkinstest.models;

import org.apache.log4j.Logger;
import org.jazzteam.jenkinstest.logic.FunctionFactory;
import org.jazzteam.jenkinstest.utils.PropertyHandler;

public class JobModel {
    private static final Logger LOG = Logger.getLogger(JobModel.class);
    private String create_job_url = PropertyHandler.getProperty("create_job_url");
    private String delete_job_url = PropertyHandler.getProperty("delete_job_url");
    private String disable_job_url = PropertyHandler.getProperty("disable_job_url");
    private String enable_job_url = PropertyHandler.getProperty("enable_job_url");
    private String get_job_description_url = PropertyHandler.getProperty("get_job_description_url");
    private String update_job_description_url = PropertyHandler.getProperty("update_job_description_url");
    private String build_job_url = PropertyHandler.getProperty("build_job_url");
    private String get_job_config_url = PropertyHandler.getProperty("get_job_config_url");
    private String copy_job_url = PropertyHandler.getProperty("copy_job_url");
    private String delete_copy_of_job_url = PropertyHandler.getProperty("delete_copy_of_job_url");

    private enum Functions {create_job, delete_job, disable_job, enable_job,
        get_job_description, update_job_description, build_job,
        get_job_config, copy_job}

    public int createJob(){
        return new FunctionFactory().function(Functions.create_job.name(), create_job_url);
    }

    public int deleteJob(){
        return new FunctionFactory().function(Functions.delete_job.name(), delete_job_url);
    }

    public int disableJob(){
        return new FunctionFactory().function(Functions.disable_job.name(), disable_job_url);
    }

    public int enableJob(){
        return new FunctionFactory().function(Functions.enable_job.name(), enable_job_url);
    }

    public int getJobDescription(){
        return new FunctionFactory().function(Functions.get_job_description.name(), get_job_description_url);
    }

    public int updateJobDescription(){
        return new FunctionFactory().function(Functions.update_job_description.name(), update_job_description_url);
    }

    public int buildJob(){
        return new FunctionFactory().function(Functions.build_job.name(), build_job_url);
    }

    public int getJobConfig(){
        return new FunctionFactory().function(Functions.get_job_config.name(), get_job_config_url);
    }

    public int copyJob(){
        return new FunctionFactory().function(Functions.copy_job.name(), copy_job_url);
    }

    public void clear(){
        new FunctionFactory().function(Functions.delete_job.name(), delete_job_url);
        new FunctionFactory().function(Functions.delete_job.name(), delete_copy_of_job_url);
    }
}
