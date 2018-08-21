package standard.jenkins.com;

import es.standard.http.client.domain.HttpResponseDTO;

public interface IJob {
    HttpResponseDTO buildConfigXMLforJobDTO(JobDTO jobDTO) throws Exception;
}