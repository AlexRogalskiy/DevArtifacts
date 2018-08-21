package com.test.jenkins.api;

import java.net.URI;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Job;
import com.offbytwo.jenkins.model.JobWithDetails;
import com.offbytwo.jenkins.model.QueueReference;

public class JenkinsPlayground {

	private static final Logger LOGGER = LoggerFactory.getLogger(JenkinsPlayground.class);
	
	
	public static void main(String[] args)
	{		
		System.out.println("dfdf");
		try 
		{
			JenkinsServer jenkins = new JenkinsServer(new URI("http://localhost:8080/"), "admin", "afe8a2414f56f764d3da5026e362f775");
			
			Map<String, Job> jobs = jenkins.getJobs();
			for(Map.Entry<String, Job> e : jobs.entrySet())
			{
				System.out.println(e.getKey() + " | "+ e.getValue().getName());
			}
			
			JobWithDetails job = jobs.get("pipeline-as-code").details();
			
			System.out.println(job.details().getLastBuild().getNumber());
			QueueReference ref = job.build(true);
			
			System.out.println(ref.getQueueItemUrlPart());
			

			
			
		}
		catch(Exception e) 
		{
			System.out.println(e);			
		}
		
		
		
	}
}

