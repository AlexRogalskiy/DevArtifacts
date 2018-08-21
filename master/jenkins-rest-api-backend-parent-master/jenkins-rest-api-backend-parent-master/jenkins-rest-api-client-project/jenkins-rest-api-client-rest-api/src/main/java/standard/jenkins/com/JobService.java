package standard.jenkins.com;

import es.standard.http.client.domain.HttpResponseDTO;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Singleton
@Path("/job")
public class JobService {

    @Inject
    private IJob jobBS;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createJob(JobDTO jobDTO){
        Response response;
        HttpResponseDTO httpResponseDTO = null;

        try {
            httpResponseDTO = this.jobBS.buildConfigXMLforJobDTO(jobDTO);

            if (httpResponseDTO == null) {
                response = Response.status(Response.Status.FORBIDDEN).build();
            } else {
                response = Response.status(Response.Status.OK).entity(httpResponseDTO).build();
            }

        } catch (Exception ex) {
            response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
        return response;
    }
}
