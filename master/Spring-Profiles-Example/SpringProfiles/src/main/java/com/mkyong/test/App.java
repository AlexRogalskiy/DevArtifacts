package com.mkyong.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.core.env.AbstractEnvironment;

import com.mkyong.movie.MovieDao;

public class App {

	private static final Logger log = LoggerFactory.getLogger(App.class);

	public static void main(String[] args) {

		System.setProperty(AbstractEnvironment.ACTIVE_PROFILES_PROPERTY_NAME, "dev");
		ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
		
		/*AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
		context.getEnvironment().setActiveProfiles("live");
		context.register(AppConfig.class);
		context.refresh();
		*/
		MovieDao obj = (MovieDao) context.getBean("movieDao");
		log.debug("Result : {}", obj.findByDirector("dummy"));
		log.debug("Result : {}", obj.findByDirector("dummy"));
		log.debug("Result : {}", obj.findByDirector("dummy"));

		((ConfigurableApplicationContext) context).close();

	}
}