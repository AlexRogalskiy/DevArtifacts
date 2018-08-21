package ie.farrengold.javaee7;

import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

/**
 * @author Brian Dinneen
 * @since July 2016
 *
 */
@ApplicationPath("/app")
public class RestApplication extends Application {

	@Override
	public Map<String, Object> getProperties() {
		Map<String, Object> properties = new HashMap<>();
		properties.put("jersey.config.server.provider.packages", "ie.farrengold.javaee7");
		return properties;
	}
}
