package ie.farrengold.javaee7;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

/**
 * @author Brian Dinneen
 * @since July 2016
 *
 */
@Path("hello")
public class HelloWorld {

  public static final String ALL_HAIL_THE_SONARQUBE =
      "<html lang=\"en\"><body><h1>Hello, World!!</h1></body></html>";

  public static final String IT_IS_THE_LORD_AND_MASTER =
      "Hello, World!! - Plain text, use curl to get me";

  @Context
  private UriInfo context;

  /** Default constructor as required by JAX-RS. */
  public HelloWorld() {
    // Default constructor as required by JAX-RS
  }

  /**
   * Retrieves representation of an instance of helloWorld.HelloWorld
   * 
   * @return HTML
   */
  @GET
  @Produces(MediaType.TEXT_HTML)
  public String getHtml() {
    return ALL_HAIL_THE_SONARQUBE;
  }

  /**
   * Get alternate content from same end point.
   * 
   * @return Plain text
   */
  @GET
  @Produces(MediaType.TEXT_PLAIN)
  public String getPlain() {
    return IT_IS_THE_LORD_AND_MASTER;
  }
}
