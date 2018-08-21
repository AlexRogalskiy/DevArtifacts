package org.jboss.jws.jwsapp;

import java.util.HashMap;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;


@Path("status")
@Produces(MediaType.APPLICATION_JSON)
public class StatusController {
	
	@GET
	public HashMap<String,String> isUp() {

		return StatusService.isUp();

	}
}
