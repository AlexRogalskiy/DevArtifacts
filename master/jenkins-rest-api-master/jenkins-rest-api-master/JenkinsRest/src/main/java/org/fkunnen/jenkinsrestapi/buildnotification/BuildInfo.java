package org.fkunnen.jenkinsrestapi.buildnotification;


public class BuildInfo {

    private String full_url;
    private int number;
    private String phase;
    private String status;
    private String url;
    private SCMInfo scm;

    public String getFull_url() {
        return full_url;
    }

    public void setFull_url(String full_url) {
        this.full_url = full_url;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public SCMInfo getScm() {
        return scm;
    }

    public void setScm(SCMInfo scm) {
        this.scm = scm;
    }

    @Override
    public String toString() {
        return "BuildInfo{" +
                "full_url='" + full_url + '\'' +
                ", number=" + number +
                ", phase='" + phase + '\'' +
                ", status='" + status + '\'' +
                ", url='" + url + '\'' +
                ", scm=" + scm +
                '}';
    }
}
