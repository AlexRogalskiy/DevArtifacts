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
import org.mule.jenkins.model.JenkinsQueueInfo;
import org.mule.jenkins.model.Job;
import org.mule.jenkins.model.JobInfo;


public class GetQueueInfoTestCases extends JenkinsTestParent {
	
    @Before
	public void setUp() {
    	
		testObjects = (HashMap<String,Object>) context.getBean("getQueueInfoTestData");
    	
		try {
			
			flow = lookupFlowConstruct("create-job");
	        response = flow.process(getTestEvent(testObjects));
	        
		    flow = lookupFlowConstruct("build");
			flow.process(getTestEvent(testObjects));
  
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
	public void testGetQueueInfo() {
    	
		try {
			
			flow = lookupFlowConstruct("get-queue-info");
			response = flow.process(getTestEvent(null));
	        
			JenkinsQueueInfo jenkinsQueueInfo =  (JenkinsQueueInfo) response.getMessage().getPayload();
			
			assertTrue(jenkinsQueueInfo.getItems().length != 0);
	        
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			fail();
		}
     
	}

}