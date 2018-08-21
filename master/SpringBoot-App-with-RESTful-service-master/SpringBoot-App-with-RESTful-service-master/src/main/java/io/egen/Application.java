package io.egen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;

import io.swagger.models.Swagger;

@SpringBootApplication
@Import({SwaggerConfig.class, WebConfig.class})
public class Application {

	public static void main(String[] args) {
		
		SpringApplication.run(Application.class, args);

	}

}
