package org.jazzteam.jenkinstest.logic;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.log4j.Logger;
import org.jazzteam.jenkinstest.utils.FileReaderFunc;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public class FunctionFactory {
    private static final Logger LOG = Logger.getLogger(FunctionFactory.class);

    public int function(String functionName, String url) {
        CloseableHttpClient httpClient = new DefaultHttpClient();
        CloseableHttpResponse response = null;
        int statusCode = 00;
        HttpPost httpPost;
        HttpGet httpGet;
        try {
            switch (functionName) {
                case "create_job":
                    httpPost = new HttpPost(url);
                    StringEntity config = new StringEntity(new FileReaderFunc().readFile("config.xml_path"));
                    httpPost.setHeader("Content-type", "application/xml");
                    httpPost.setEntity(config);
                    response = httpClient.execute(httpPost);
                    break;
                case "delete_job":
                    httpPost = new HttpPost(url);
                    response = httpClient.execute(httpPost);
                    break;
                case "enable_job":
                    httpPost = new HttpPost(url);
                    response = httpClient.execute(httpPost);
                    break;
                case "disable_job":
                    httpPost = new HttpPost(url);
                    response = httpClient.execute(httpPost);
                    break;
                case "get_job_description":
                    httpGet = new HttpGet(url);
                    response = httpClient.execute(httpGet);
                    break;
                case "update_job_description":
                    httpGet = new HttpGet(url);
                    response = httpClient.execute(httpGet);
                    break;
                case "build_job":
                    httpPost = new HttpPost(url);
                    response = httpClient.execute(httpPost);
                    break;
                case "get_job_config":
                    httpGet = new HttpGet(url);
                    response = httpClient.execute(httpGet);
                    break;
                case "copy_job":
                    httpPost = new HttpPost(url);
                    response = httpClient.execute(httpPost);
                    break;
                case "jenkins_quiet_down":
                    httpPost = new HttpPost(url);
                    response = httpClient.execute(httpPost);
                    break;
                case "jenkins_cancel_quiet_down":
                    httpPost = new HttpPost(url);
                    response = httpClient.execute(httpPost);
                    break;
                case "jenkins_restart":
                    httpPost = new HttpPost(url);
                    response = httpClient.execute(httpPost);
                    break;
                case "jenkins_safe_restart":
                    Thread.sleep(30000);
                    //I haven't learned yet how to handle such situations.
                    //It can be done through socket.connect(new InetSocketAddress(host, port), timeout)
                    //or any testing tool like REST_Assured, maybe...
                    httpPost = new HttpPost(url);
                    response = httpClient.execute(httpPost);
                    break;
                default:
                    throw new RuntimeException("Wrong function name!");
            }
            statusCode = response.getStatusLine().getStatusCode();
        } catch (UnsupportedEncodingException e) {
            LOG.error("UnsupportedEncodingException", e);
        } catch (ClientProtocolException e) {
            LOG.error("ClientProtocolException", e);
        } catch (IOException e) {
            LOG.error("IOException", e);
        } catch (InterruptedException e) {
            LOG.error("InterruptedException", e);
        } finally {
            if(response != null)
                try {
                    response.close();
                } catch (IOException e) {
                    LOG.error("IOException in response.close()", e);
                }
        }
        return statusCode;
    }
}
