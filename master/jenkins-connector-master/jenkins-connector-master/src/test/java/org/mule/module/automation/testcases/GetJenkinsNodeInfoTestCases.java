/**
 *
 * Copyright (c) MuleSoft, Inc.  All rights reserved.  http://www.mulesoft.com
 *
 * The software in this package is published under the terms of the CPAL v1.0
 * license, a copy of which has been included with this distribution in the
 * LICENSE.txt file.
 */

package org.mule.module.automation.testcases;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.HashMap;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.mule.jenkins.model.JenkinsInfo;
import org.mule.jenkins.model.Job;
import org.mule.jenkins.model.JobInfo;


public class GetJenkinsNodeInfoTestCases extends JenkinsTestParent {
	
    @Before
	public void setUp() {
    	
		testObjects = (HashMap<String,Object>) context.getBean("getJenkinsNodeInfoTestData");
    	
		try {
			
			flow = lookupFlowConstruct("create-job");
	        response = flow.process(getTestEvent(testObjects));
  
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			fail();
		}
     
	}
    
    @After
	public void tearDown() {
		
		try {
			
	    flow = lookupFlowConstruct("delete-job");
		flow.process(getTestEvent(testObjects));

		} catch (Exception e) {
			// TODO Auto-generated catch block
				e.printStackTrace();
				fail();
		}
		
	}
	
    @Category({SanityTests.class})
	@Test
	public void testGetJenkinsNodeInfo() {
    	
    	boolean found = false;
    	int index = 0;
    	
		try {
			
			flow = lookupFlowConstruct("get-jenkins-node-info");
			response = flow.process(getTestEvent(null));
	        
			JenkinsInfo jenkinsInfo =  (JenkinsInfo) response.getMessage().getPayload();
			Job[] jobs = jenkinsInfo.getJobs();
			
			do {

				if (jobs[index].getName().trim().equals(testObjects.get("jobName").toString().trim())) {
					found = true;
				}
				index++;
			} while ((!found) && (index<jobs.length));
			
			assertTrue(found);
	        
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			fail();
		}
     
	}

}