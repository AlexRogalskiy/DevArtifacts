package com.ryancarrigan.jenkins.download;

/**
 * Created by Suave Peanut on 2014.5.23.
 */
public enum API {
    XML("xml"),
    JSON("json"),
    PYTHON("python");

    private final String api;
    private API(final String api) {
        this.api = api;
    }

    protected String getApi() {
        return api;
    }
}
