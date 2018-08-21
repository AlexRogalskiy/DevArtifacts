package com.mnk.jenkins.plugins.dockerparameter;

/**
 * Created by momin on 10/23/2015.
 */
public class DockerRegistryConstants {
    public static final String REGISTRY_V1_PING = "/v1/_ping";
    public static final String REGISTRY_V2_PING = "/v2";
    public static final String DOCKER_HUB_INDEX = "index.docker.io";

    public static enum RegistryApiVersion {
        V1("v1"), V2("v2");

        private String value;

        public String getValue() {
            return this.value;
        }

        RegistryApiVersion(String value) {
            this.value = value;
        }
    }

}
