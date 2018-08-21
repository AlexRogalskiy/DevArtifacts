/**
 * 
 */
package ie.farrengold.javaee7;

import static org.junit.Assert.assertEquals;
import static javax.ws.rs.core.Response.Status.OK;

import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.test.TestProperties;
import org.junit.Test;

/**
 * @author Brian
 *
 */
public class HelloWorldTest extends org.glassfish.jersey.test.JerseyTest {

	@Override
	protected Application configure() {
		enable(TestProperties.LOG_TRAFFIC);
		enable(TestProperties.DUMP_ENTITY);
		// return new RestApplication();
		return new ResourceConfig(HelloWorld.class);
	}

	// @Override
	// protected TestContainerFactory getTestContainerFactory() throws
	// TestContainerException {
	//// return new ExternalTestContainerFactory();
	// return new JettyTestContainerFactory();
	// }

	// @Override
	// protected URI getBaseUri() {
	// return UriBuilder.fromUri(super.getBaseUri()).path("app").build();
	// }

	/**
	 * Test method for {@link ie.farrengold.javaee7.HelloWorld#getHtml()}.
	 */
	@Test
	public final void testGetHtml() {
		String expected = "<html lang=\"en\"><body><h1>Hello, World!!</h1></body></html>";
		// String s = target().path("dog").request().get(String.class);
		// String response = target("app").request("hello").get(String.class);
		// String response = target().request("hello").get(String.class);
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
