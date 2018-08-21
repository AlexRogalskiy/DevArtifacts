package standard.jenkins.com.interfaces;

import es.standard.http.client.domain.HttpRequestDTO;
import standard.jenkins.com.JobDTO;
import standard.jenkins.com.UserDTO;

public interface IJobDAO {
    JobDTO updateConfigXML (JobDTO jobDTO) throws Exception;
    HttpRequestDTO sendRequestToJenkinsRestApi(JobDTO jobDTO, String jenkinsIP) throws Exception;
}
