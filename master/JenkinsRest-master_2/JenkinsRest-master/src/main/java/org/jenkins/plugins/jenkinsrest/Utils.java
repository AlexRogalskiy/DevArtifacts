package org.jenkins.plugins.jenkinsrest;

import hudson.model.Run;
import org.apache.commons.lang.StringUtils;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

/**
 * @author Yusuke Tsutsumi
 */
public class Utils {
    public final static Logger LOG = Logger.getLogger(JenkinsRest.class.getName());
    private static HttpClient httpclient = new DefaultHttpClient();

    // specialize a template string with build information
    public static String buildPostString(String template, Run r) {
        String postString = template;
        postString = postString.replace(
                "%DATETIME%", r.getTime().toString());
        postString = postString.replace(
                "%BUILD_NUMBER%", Integer.toString(r.getNumber()));
        postString = postString.replace(
                "%BUILD_ID%", r.getId());
        postString = postString.replace(
                "%JOB_NAME%", r.getParent().getDisplayName());
        postString = postString.replace(
                "%BUILD_MESSAGE%", r.getBuildStatusSummary().message);
        return postString;
    }

    public static void setHttpClient(HttpClient client) {
        httpclient = client;
    }

    public static void sendRest(boolean isPost,
                                String url,
                                String contentType,
                                String postString) {
        try {
            if(isPost) {
                sendPostRequest(url, contentType, postString);
            } else {
                sendGetRequest(url);
            }
        } catch (IOException e) {
            LOG.severe("Unable to send rest api request!: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static List<String> parseURLList(String urlList) {
        // really janky parsing, since we currently don't get valid json from the request, *and* it's unescaped :/
        List<String> urls = new ArrayList<String>();

        // Strip characters that could be used for JSON formatting (some sources push JSON to the field), and replace all whitespace
        urlList = urlList.replaceAll("[\\[\\]\"' ]", "");

        if (StringUtils.isNotEmpty(urlList)) {
            urls = Arrays.asList(urlList.split(","));
        }
        return urls;
    }

    private static void sendGetRequest(String restURL) throws IOException {
        HttpGet request = new HttpGet(restURL);
        httpclient.execute(request);
        request.releaseConnection();
    }

    private static void sendPostRequest(String restURLs, String contentType, String restString) throws IOException {
        HttpPost request = new HttpPost(restURLs);
        request.setEntity(new StringEntity(restString));
        request.setHeader("Content-type", contentType);
        httpclient.execute(request);
        request.releaseConnection();
    }
}
