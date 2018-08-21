package standard.jenkins.com;

public class JobDTO {
    private String _url;
    private String _jobName;
    private String _configXML;

    public JobDTO() {
        this._url = null;
        this._jobName = null;
        this._configXML = null;
    }

    public String getUrl() {
        return _url;
    }

    public void setUrl(String _url) {
        this._url = _url;
    }

    public String getJobName() {
        return _jobName;
    }

    public void setJobName(String _jobName) {
        this._jobName = _jobName;
    }

    public String getConfigXML() {
        return _configXML;
    }

    public void setConfigXML(String _configXML) {
        this._configXML = _configXML;
    }
}
