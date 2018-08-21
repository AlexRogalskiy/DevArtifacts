package me.jonathan.api.util;


/**
 * This singleton class for generate JSON object from jackson
 *
 * @author 	Jonathan Zhang<br>
 *			mohistzh@gmail.com
 * @since   Mar 10, 2014
 * @version 0.0.1-SNAPSHOT
 */
public class JacksonUtil {
	
	private static JacksonUtil object = null;
	private JacksonUtil() {
		object = new JacksonUtil();
	}
	public static JacksonUtil getInstance() {
		return object;
	}
	static {
		object = new JacksonUtil();
	}
	
	
}
