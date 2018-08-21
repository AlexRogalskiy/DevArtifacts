package com.kp.rest.client;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Base64;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

import com.google.gson.Gson;

public class CreateJenkinsJob {
	
	public static void main(String[] args){
		try {
			String jenkinsUrl = "http://localhost:9090";
			String username = "admin";
	        String password = "857576f82cee4a81b4250b88fb2c0e24";
	        String newJobName= "HelloWorldAutomatic";
	        //NOTE: config file should be present in the classpath
	        String configFileName = "config.xml";
			String res = makePostRequestToCreateNewJob(newJobName, jenkinsUrl, username, password,configFileName);
			System.out.println(res);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	/**
	 * Method to get the Base64 encoded string for given username and password
	 * @param username
	 * @param password
	 * @return base64Encoded string for input username and password
	 * @throws UnsupportedEncodingException
	 */
	public static String getBase64EncodedAuthorizationParameter(String username, String password) throws UnsupportedEncodingException{
		String authString = username + ":" + password;
        String authStringEnc = Base64.getEncoder().encodeToString(authString.getBytes("utf-8"));
        String base64EncodedCredentials = "Basic "+authStringEnc;
        return base64EncodedCredentials;
	}
	
	/**
	 * Method to make a post request to JEnkins API for creating a jenkins job with given input config File name
	 * @param jobName
	 * @param jenkinsUrl
	 * @param username
	 * @param password
	 * @param configFileName
	 * @return Success or failure message for job creation
	 * @throws ParseException
	 * @throws IOException
	 */
	public static String makePostRequestToCreateNewJob(String jobName, String jenkinsUrl, String username, String password, String configFileName) throws ParseException, IOException{
		HttpClient httpClient = HttpClientBuilder.create().build();
		StringBuffer sbuf = new StringBuffer(jenkinsUrl);
		sbuf.append("/createItem?name=");
		sbuf.append(jobName);
		//TODO: enable this only if CSRF prevention is enabled in jenkins global security
		//Get crumb
		CrumbJson crumbJson = makeGetRequestToGetCrumb(jenkinsUrl,username, password);
		String base64EncodedAuthParam = getBase64EncodedAuthorizationParameter(username, password);
		System.out.println("CreateJenkinsJob.makePostRequestToCreateNewJob() base64EncodedAuthParam: "+base64EncodedAuthParam);
		//NOTE: config file should be available in the classpath
		String xmlInput = convertXmlToString(configFileName);
		StringEntity xmlEntity = new StringEntity(xmlInput);
		HttpPost postRequest = new HttpPost(sbuf.toString());
		postRequest.setHeader("Authorization", base64EncodedAuthParam);
		postRequest.setHeader("Content-type","application/xml");
		//TODO: set this in header only if CSRF prevention is enabled in jenkins global security
		postRequest.setHeader(crumbJson.crumbRequestField,crumbJson.crumb);
		postRequest.setEntity(xmlEntity);
		System.out.println("CreateJenkinsJob.makePostRequestToCreateNewJob() postRequest URI: "+postRequest.getURI());
        HttpResponse response = httpClient.execute(postRequest);
        String result = "";
        if(response.getStatusLine().getStatusCode() == 200){
        	result = "Jenkins Job " + jobName+ " created successfully!";
        }else{
        	result = "Failed to create Jenkins job " + jobName;
        }
        System.out.println("CreateJenkinsJob.makePostRequestToCreateNewJob() result: "+result);
        return result;
	}
	
	/**
	 * Convert input config file xml into string
	 * @param xmlFilePath
	 * @return String
	 * @throws IOException
	 */
	public static String convertXmlToString(String xmlFilePath) throws IOException{
		InputStream is = new FileInputStream(xmlFilePath);
		String str = IOUtils.toString(is, "UTF-8");
		System.out.println("CreateJenkinsJob.convertXmlToString() str value: "+str);
		return str;
	}

	/**
	 * Method to get the Jenkins CrumbIssuer credentials for given username and password
	 * @param jenkinsUrl
	 * @param username
	 * @param password
	 * @return Json object
	 * @throws ClientProtocolException
	 * @throws IOException
	 */
	public static CrumbJson makeGetRequestToGetCrumb(String jenkinsUrl,String username, String password) throws ClientProtocolException, IOException{
		StringBuffer sbuf = new StringBuffer(jenkinsUrl);
		sbuf.append("/crumbIssuer/api/json");
		String base64EncodedAuthParam = getBase64EncodedAuthorizationParameter(username, password);
		HttpClient client = HttpClientBuilder.create().build();
		HttpGet request = new HttpGet(sbuf.toString());
		request.setHeader("Authorization", base64EncodedAuthParam);
		HttpResponse response = client.execute(request);
		String result = EntityUtils.toString(response.getEntity());
		System.out.println("CreateJenkinsJob.makeGetRequestToGetCrumb() result: "+result);
		CrumbJson crumbJson = new Gson().fromJson(result, CrumbJson.class);
		return crumbJson;
	}
	
	public static class CrumbJson {
        public String crumb;
        public String crumbRequestField;
    }
	
}


