package co.dragonfly.jersey_example.services;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

@Path("/user")
public class UserService {

  @GET
  @Path("/{name}")
  public String sayHello(@PathParam("name") String name) {
    String output = "Hi from Jersey REST: " + name;
    return output;
  }
}
