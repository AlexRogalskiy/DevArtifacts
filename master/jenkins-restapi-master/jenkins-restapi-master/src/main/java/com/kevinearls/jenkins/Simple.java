package com.kevinearls.jenkins;

import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.AuthCache;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.BasicAuthCache;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;

/**
 * Created by kearls_work on 21/07/14.  Based on code from
 * From https://wiki.jenkins-ci.org/display/JENKINS/Authenticating+scripted+clients
 *
 * This does a simple GET/POST update of the config.xml for a Jenkins job.
 */
public class Simple {
    private CloseableHttpClient httpClient = null;
    private HttpHost host = null;
    private HttpClientContext localContext = null;
    private AuthCache authCache = null;

    public void setUpHttpClient(String urlString, String username, String password) {
        URI uri = URI.create(urlString);
        host = new HttpHost(uri.getHost(), uri.getPort(), uri.getScheme());

        UsernamePasswordCredentials usernamePasswordCredentials =  new UsernamePasswordCredentials(username, password);
        CredentialsProvider credentialProvider = new BasicCredentialsProvider();
        AuthScope authScope = new AuthScope(uri.getHost(), uri.getPort());
        credentialProvider.setCredentials(authScope, usernamePasswordCredentials);
        authCache = new BasicAuthCache();
        BasicScheme basicScheme = new BasicScheme();
        authCache.put(host, basicScheme);
        HttpClientBuilder clientBuilder = HttpClients.custom();
        clientBuilder.setDefaultCredentialsProvider(credentialProvider);
        httpClient = clientBuilder.build();
    }

    /**
     * Get the config.xml for a job
     *
     * TODO check response
     *
     * @param urlString
     * @param username
     * @param password
     * @return
     * @throws ClientProtocolException
     * @throws IOException
     */
    public String getConfig(String urlString, String username, String password) throws ClientProtocolException, IOException {
        URI uri = URI.create(urlString);

        HttpGet httpGet = new HttpGet(uri);
        localContext = HttpClientContext.create();
        localContext.setAuthCache(authCache);

        HttpResponse response = httpClient.execute(host, httpGet, localContext);
        //reportResponse(response);
        // TODO check response code

        String config = EntityUtils.toString(response.getEntity());
        return config;
    }

    /**
     * Do a post to the urlString given to update this job.
     *
     * @param urlString
     * @param updatedConfig
     * @throws ClientProtocolException
     * @throws IOException
     */
    public void updateConfig(String urlString, String updatedConfig) throws ClientProtocolException, IOException  {
        HttpPost post = new HttpPost(urlString);
        StringEntity configEntity = new StringEntity(updatedConfig);
        post.setEntity(configEntity);
        HttpResponse postResponse = httpClient.execute(host, post, localContext);
        reportResponse(postResponse);
    }


    /**
     * TODO deal with errors
     * @param response
     * @throws IOException
     */
    public void reportResponse(HttpResponse response) throws IOException {
        System.out.println("RESPONSE: " + response.getStatusLine().getStatusCode() + " " + response.getStatusLine().getReasonPhrase());
        BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line = "";
        while ((line = rd.readLine()) != null) {
            System.out.println(line);
        }
    }


    public static void main(String[] args) throws Exception {
        Simple me = new Simple();
        String urlString = "http://localhost:8080/job/cruft8/config.xml";
        String user = "kearls";
        String apiToken = "dd7fee6136986f34e94b14f871db138a";   // go to jenkins_url/me/configure

        me.setUpHttpClient(urlString, user, apiToken);
        String config = me.getConfig(urlString, user, apiToken);
        String updatedConfig = config.replace("<jdk>jdk8</jdk>", "<jdk>jdk7</jdk>");
        me.updateConfig(urlString, updatedConfig);
    }
}
