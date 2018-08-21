package standard.jenkins.com;

import es.standard.http.client.api.IHttpBS;
import es.standard.http.client.api.IHttpJenkinsBS;
import es.standard.http.client.domain.HttpRequestDTO;
import es.standard.http.client.domain.HttpResponseDTO;
import standard.jenkins.com.interfaces.IJobDAO;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class JobBS implements IJob {

    private IJobDAO jobDAO;

    @Inject
    private IUser user;

    @Inject
    private IHttpJenkinsBS httpJenkinsBS;

    @Inject
    private IInfraestructure infraestructure;

    @Inject
    public void setDAO(IJobDAO jobDAO) {
        this.jobDAO = jobDAO;
    }

    public HttpResponseDTO buildConfigXMLforJobDTO(JobDTO jobDTO) throws Exception {
        UserDTO userDTO = null;

        try {
            userDTO = this.user.getUserDTOFromEnvironmentVariables();
            return this.httpJenkinsBS.request(this.jobDAO.sendRequestToJenkinsRestApi(this.jobDAO.updateConfigXML(jobDTO), this.getJenkinsIPFromEnvironmentVariables()),
                                                userDTO.getUsername(), userDTO.getPassword());

        } catch (Exception ex) {
            throw ex;
        }
    }

    private String getJenkinsIPFromEnvironmentVariables() throws Exception {
        String jenkinsIP = null;

        try {
            jenkinsIP = this.infraestructure.getStringValueFromEnvironmentVariable(Constants.JENKINS_IP);
            return jenkinsIP;

        } catch (Exception ex) {
            throw ex;
        }
    }
}