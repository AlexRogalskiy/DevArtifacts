/**
 * Created by tzach on 26-May-16.
 */
import org.glassfish.jersey.client.ClientConfig;
import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


public class JenkinsJerseyClient {

	
    public Response invoke(String username, String password, String firstname){
		// Assuming jenkins URL is myjenkins with default port 8080 with job named hello_world
        String target = "http://myjenkins:8080/job/hello_world/buildWithParameters";

		// Creating the username password authentication
        HttpAuthenticationFeature httpAuthenticationFeature = HttpAuthenticationFeature.basicBuilder()
                .credentials(username, password)
                .build();

        ClientConfig clientConfig = new ClientConfig();
        clientConfig.register(httpAuthenticationFeature);

        Client client = ClientBuilder.newClient(clientConfig);

        WebTarget webTarget = client.target(target);
		// Adding the parameter as form parameter
        Form form = new Form();
        form.param("firstname", firstname);

		// Running the Rest request as POST
        return webTarget.request(MediaType.APPLICATION_JSON_TYPE)
                .post(Entity.entity(form, MediaType.APPLICATION_FORM_URLENCODED_TYPE));
    }

    public static void main(String[] args) {
        System.out.println(new JenkinsJerseyClient().invoke("tzachs","tzachs_password","tzach").getStatus());
    }
}