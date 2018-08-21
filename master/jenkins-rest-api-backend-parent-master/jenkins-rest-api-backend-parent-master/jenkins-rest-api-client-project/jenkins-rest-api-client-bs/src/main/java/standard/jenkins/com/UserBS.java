package standard.jenkins.com;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class UserBS implements IUser {

    @Inject
    public IInfraestructure infraestructure;

    public UserDTO getUserDTOFromEnvironmentVariables() throws Exception {
        UserDTO userDTO = null;

        try {
            userDTO = new UserDTO();
            userDTO.setUsername(this.infraestructure.getStringValueFromEnvironmentVariable(Constants.JENKINS_REST_API_USERNAME));
            userDTO.setPassword(this.infraestructure.getStringValueFromEnvironmentVariable(Constants.JENKINS_REST_API_PASSWORD));
            return userDTO;

        } catch (Exception ex) {
            throw ex;
        }
    }
}
