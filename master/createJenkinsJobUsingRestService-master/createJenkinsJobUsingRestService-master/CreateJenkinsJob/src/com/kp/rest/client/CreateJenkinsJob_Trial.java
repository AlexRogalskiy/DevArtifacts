package com.kp.rest.client;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import com.google.gson.Gson;


public class CreateJenkinsJob_Trial {
	public static void main(String[] args){
		try {
			String res = makePostRequestToCreateNewJob("HelloWorldAutomatic");
			//String res = makePostRequestToCreateNewJob();
			//String res = makeGetRequestToInvokeJob();
			System.out.println("CreateJenkinsJob.main() result is "+res);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public static String getBase64EncodedAuthorizationParameter() throws UnsupportedEncodingException{
		String username = "admin";
        String password = "857576f82cee4a81b4250b88fb2c0e24";
        String authString = username + ":" + password;
        String authStringEnc = Base64.getEncoder().encodeToString(authString.getBytes("utf-8"));
        String base64EncodedCredentials = "Basic "+authStringEnc;
        return base64EncodedCredentials;
	}
	
	
	
	public static String makePostRequestToCreateNewJob(String jobName) throws ParseException, IOException{
		HttpClient httpClient = HttpClientBuilder.create().build();
		
		String restUrl = "http://localhost:9090/createItem";
		StringBuffer sbuf = new StringBuffer();
		sbuf.append(restUrl);
		sbuf.append("?");
		sbuf.append("name=");
		sbuf.append(jobName);
		//TODO: enable this only if CSRF prevention is enabled in jenkins global security
		//Get crumb
		CrumbJson crumbJson = makeGetRequestToGetCrumb();
		String base64EncodedAuthParam = getBase64EncodedAuthorizationParameter();
		System.out.println("CreateJenkinsJob.makePostRequestToCreateNewJob() base64EncodedAuthParam: "+base64EncodedAuthParam);
		String xmlInput = convertXmlToString("config.xml");
		StringEntity xmlEntity = new StringEntity(xmlInput);
		HttpPost postRequest = new HttpPost(sbuf.toString());
		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		urlParameters.add(new BasicNameValuePair("name", "HelloWorldAutomatic"));
		postRequest.setEntity(new UrlEncodedFormEntity(urlParameters));
		postRequest.setHeader("Authorization", base64EncodedAuthParam);
		postRequest.setHeader("Content-type","application/xml");
		//TODO: set this in header only if CSRF prevention is enabled in jenkins global security
		postRequest.setHeader(crumbJson.crumbRequestField,crumbJson.crumb);
		postRequest.setEntity(xmlEntity);
		System.out.println("CreateJenkinsJob.makePostRequestToCreateNewJob() postRequest URI: "+postRequest.getURI());
        HttpResponse response = httpClient.execute(postRequest);
        String result = EntityUtils.toString(response.getEntity());
        System.out.println("CreateJenkinsJob.makePostRequestToCreateNewJob() result: "+result);
        return result;
	}
	
	public static String convertXmlToString(String xmlFilePath) throws IOException{
		InputStream is = new FileInputStream(xmlFilePath);
		String str = IOUtils.toString(is, "UTF-8");
		System.out.println("CreateJenkinsJob.convertXmlToString() str value: "+str);
		return str;
	}

	public static String makeGetRequestToInvokeJob() throws ClientProtocolException, IOException{
		String url = "http://admin:857576f82cee4a81b4250b88fb2c0e24@localhost:9090/job/HelloWorld/build";
		HttpClient client = HttpClientBuilder.create().build();
		HttpGet request = new HttpGet(url);
		HttpResponse response = client.execute(request);
		String result = EntityUtils.toString(response.getEntity());
		System.out.println("CreateJenkinsJob.makeGetRequestToInvokeJob() result: "+result);
		return result;
	}
	
	public static CrumbJson makeGetRequestToGetCrumb() throws ClientProtocolException, IOException{
		String url = "http://localhost:9090/crumbIssuer/api/json";
		String base64EncodedAuthParam = getBase64EncodedAuthorizationParameter();
		HttpClient client = HttpClientBuilder.create().build();
		HttpGet request = new HttpGet(url);
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
