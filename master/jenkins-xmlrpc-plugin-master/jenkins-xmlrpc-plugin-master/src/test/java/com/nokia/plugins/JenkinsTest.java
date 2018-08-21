package com.nokia.plugins;

import hudson.model.FreeStyleBuild;
import hudson.model.FreeStyleProject;
import hudson.model.Hudson;
import hudson.tasks.BatchFile;
import hudson.util.VersionNumber;

import java.io.File;

import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.jvnet.hudson.test.HudsonTestCase;

public class JenkinsTest extends HudsonTestCase {
    
    @Test
    public void testJenkinsVersion() {
        VersionNumber version = Hudson.getVersion();
        assertTrue("1.399".compareTo(version.toString())<0);
    }

    @Test
    public void testJenkinsProjects() throws Exception {
        File rootDir = hudson.getRootDir();
        System.out.println("Number of projects: "+hudson.getProjects().size());
        System.out.println(rootDir);
        
        FreeStyleProject project = createFreeStyleProject();
        project.getBuildersList().add(new BatchFile("echo hello"));
        
        FreeStyleBuild build = project.scheduleBuild2(0).get();
        
        System.out.println(build.getDisplayName()+" completed");
        
        String log = FileUtils.readFileToString(build.getLogFile());
        assertTrue(log.contains("hello"));
        System.out.println(project.getRootDir());
        System.out.println("Number of projects: "+hudson.getProjects().size());
    }
    
}
