package ie.farrengold.javaee7;

import static org.junit.Assert.assertEquals;

import java.net.URI;

import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.test.DeploymentContext;
import org.glassfish.jersey.test.JerseyTest;
import org.glassfish.jersey.test.TestProperties;
import org.glassfish.jersey.test.external.ExternalTestContainerFactory;
import org.glassfish.jersey.test.spi.TestContainerException;
import org.glassfish.jersey.test.spi.TestContainerFactory;
import org.junit.Test;

/**
 * Noddy Intergration test
 * 
 * @author Brian Dinneen
 *
 */
public class HelloWorldIT extends JerseyTest {

	@Override
	protected Application configure() {
		enable(TestProperties.LOG_TRAFFIC);
		enable(TestProperties.DUMP_ENTITY);
		return new ResourceConfig(HelloWorld.class);
	}

	@Override
	protected TestContainerFactory getTestContainerFactory() throws TestContainerException {
		return new ExternalTestContainerFactory();
	}

	@Override
	protected DeploymentContext configureDeployment() {
		return DeploymentContext.builder(new RestApplication()).build();
	}

	@Override
	protected URI getBaseUri() {
		return UriBuilder.fromUri(super.getBaseUri()).path("RESTful/app").build();
	}

	/**
	 * Test method for {@link ie.farrengold.javaee7.HelloWorld#getHtml()}.
	 */
	@Test
	public final void testGetHtml() {
		String expected = "<html lang=\"en\"><body><h1>Hello, World!!</h1></body></html>";
		String response = target().path("/hello").request().get(String.class);
		assertEquals(expected, response);
	}

	/**
	 * Test method for {@link ie.farrengold.javaee7.HelloWorld#getHtml()}.
	 */
	@Test
	public final void testGetStatusCode() {
		int expected = javax.ws.rs.core.Response.Status.OK.getStatusCode();
		Response output = target().path("/hello").request().get();
		int response = output.getStatus();
		assertEquals(expected, response);
	}

	/**
	 * Test method for {@link ie.farrengold.javaee7.HelloWorld#getPlain()}.
	 */
	@Test
	public final void testGetPlain() {
		String expected = "Hello, World!! - Plain text, use curl to get me";
		String response = target().path("/hello").request(MediaType.TEXT_PLAIN).get(String.class);
		assertEquals(expected, response);
	}

}
