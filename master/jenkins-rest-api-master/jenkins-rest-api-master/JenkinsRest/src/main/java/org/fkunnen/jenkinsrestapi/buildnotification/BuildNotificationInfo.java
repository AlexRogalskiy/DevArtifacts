package org.fkunnen.jenkinsrestapi.buildnotification;


public class BuildNotificationInfo {

    private String name;
    private String url;
    private BuildInfo build;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public BuildInfo getBuild() {
        return build;
    }

    public void setBuild(BuildInfo build) {
        this.build = build;
    }

    @Override
    public String toString() {
        return "BuildNotificationInfo{" +
                "name='" + name + '\'' +
                ", url='" + url + '\'' +
                ", build=" + build +
                '}';
    }
}
