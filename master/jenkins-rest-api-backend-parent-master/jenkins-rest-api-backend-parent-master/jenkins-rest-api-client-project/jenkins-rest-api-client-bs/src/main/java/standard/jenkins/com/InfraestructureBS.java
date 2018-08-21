package standard.jenkins.com;

import java.util.Map;
import javax.inject.Singleton;


@Singleton
public class InfraestructureBS implements IInfraestructure {

    @Override
    public String getStringValueFromEnvironmentVariable(String environmentVariable) throws Exception {
        String currentEnvironmentValue = null;

        try {
            currentEnvironmentValue = this.getValueFromEnvironmentVariable(environmentVariable);

            return currentEnvironmentValue;

        } catch(Exception ex) {
            throw ex;
        }
    }

    private String getValueFromEnvironmentVariable(String environmentVariable) throws Exception {
        String environmentVariableValue = null;

        try {
            Map<String, String> env = System.getenv();
            for (String envName : env.keySet()) {
                if (envName.equals(environmentVariable)) {
                    if (env.get(envName) != null
                            && !env.get(envName).trim().equals("")) {
                        environmentVariableValue = env.get(envName);
                        break;
                    }
                }
            }

            return environmentVariableValue;
        } catch (Exception ex) {
            throw ex;
        }
    }
}
