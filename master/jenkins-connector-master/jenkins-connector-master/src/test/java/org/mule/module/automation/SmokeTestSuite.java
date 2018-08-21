/**
 *
 * Copyright (c) MuleSoft, Inc.  All rights reserved.  http://www.mulesoft.com
 *
 * The software in this package is published under the terms of the CPAL v1.0
 * license, a copy of which has been included with this distribution in the
 * LICENSE.txt file.
 */

package org.mule.module.automation;

import org.junit.experimental.categories.Categories;
import org.junit.experimental.categories.Categories.IncludeCategory;
import org.junit.runner.RunWith;
import org.junit.runners.Suite.SuiteClasses;
import org.mule.module.automation.testcases.*;

@RunWith(Categories.class)
@IncludeCategory(SmokeTests.class)
@SuiteClasses({ 
		CreateJobTestCases.class, DeleteJobTestCases.class, 
		BuildTestCases.class, CopyJobTestCases.class,
		DisableJobTestCases.class, EnableJobTestCases.class, 
		GetJenkinsNodeInfoTestCases.class, GetJobBuildInfoTestCases.class, 
		GetJobBuildLogTestCases.class, GetJobInfoTestCases.class, 
		GetQueueInfoTestCases.class
		})
public class SmokeTestSuite {
}
