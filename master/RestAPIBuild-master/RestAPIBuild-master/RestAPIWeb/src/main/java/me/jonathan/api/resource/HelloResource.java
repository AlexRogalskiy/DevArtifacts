package me.jonathan.api.resource;

import java.util.Arrays;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;


/**
 * Hello resource(exposed at "hello" path)
 * @author Jonathan Zhang
 * @version 0.0.1
 *
 */
@Path("hello")
public class HelloResource {

	/**
	 * A simple method for verify apache wink and javadoc
	 * @return String that will be returned as text/plain response.
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getIt() {
		return Arrays.asList(new String[]{"Hello Jonathan","Hello Stephen"});
	}
}
