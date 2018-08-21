package com.mnk.jenkins.plugins.dockerparameter;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.apache.commons.httpclient.HttpStatus;
import sun.net.www.http.HttpClient;

import java.util.logging.Logger;

public class DockerRegistryHelper {
    private static final Logger LOGGER = Logger.getLogger(DockerRegistryHelper.class.getName());

    public static HttpResponse<JsonNode> get(String url) {
        HttpResponse<JsonNode> response = null;
        try {
            response = Unirest.get(url).asJson();
        } catch (UnirestException e) {
            LOGGER.warning(Messages.DockerRegistryHelper_InaccessibleUrl());
            e.printStackTrace();
        }
        return response;
    }

    public static int getResponseCode(String url) {
        HttpResponse<JsonNode> response;
        int responseCode = 0;
        try {
            response = Unirest.get(url).asJson();
            responseCode = response.getStatus();
        } catch (UnirestException e) {
            // NO-OP
        }
        return responseCode;
    }

    public static String getRegistryApiVersion(String url) {
        String apiVersion = "";

        if(getResponseCode(url + DockerRegistryConstants.REGISTRY_V1_PING) == HttpStatus.SC_OK) {
            apiVersion = DockerRegistryConstants.RegistryApiVersion.V1.getValue();
        } else if (getResponseCode(url + DockerRegistryConstants.REGISTRY_V2_PING) == HttpStatus.SC_OK) {
            apiVersion = DockerRegistryConstants.RegistryApiVersion.V2.getValue();
        }
        return apiVersion;
    }
}
