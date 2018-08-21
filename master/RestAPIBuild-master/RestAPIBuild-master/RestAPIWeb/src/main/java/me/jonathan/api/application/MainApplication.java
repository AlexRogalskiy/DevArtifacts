package me.jonathan.api.application;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import me.jonathan.api.resource.AccountResource;
import me.jonathan.api.resource.HelloResource;

import org.codehaus.jackson.jaxrs.JacksonJaxbJsonProvider;
import org.codehaus.jackson.map.AnnotationIntrospector;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.introspect.JacksonAnnotationIntrospector;
import org.codehaus.jackson.xc.JaxbAnnotationIntrospector;


/**
 * <b>Main resources provider</b>
 *
 * @author 	Jonathan Zhang<br>
 *			mohistzh@gmail.com
 * @since   Mar 10, 2014
 * @version 0.0.1-SNAPSHOT
 */
public class MainApplication extends Application {
	@Override
	public Set<Class<?>> getClasses() {
		Set<Class<?>> classes = new HashSet<Class<?>>();
		classes.add(HelloResource.class);
		classes.add(AccountResource.class);
		return classes;
	}
	@Override
	public Set<Object> getSingletons() {
		Set<Object> set = new HashSet<Object>();
		ObjectMapper objectMapper = new ObjectMapper();
		AnnotationIntrospector primary = new JaxbAnnotationIntrospector();
		AnnotationIntrospector second = new JacksonAnnotationIntrospector();
		AnnotationIntrospector pair = new AnnotationIntrospector.Pair(primary, second);
		objectMapper.getDeserializationConfig().withAnnotationIntrospector(pair);
		objectMapper.getSerializationConfig().withAnnotationIntrospector(pair);
		JacksonJaxbJsonProvider jaxbProvider = new JacksonJaxbJsonProvider();
		jaxbProvider.setMapper(objectMapper);
		set.add(jaxbProvider);
		return set;
		
	}
}
