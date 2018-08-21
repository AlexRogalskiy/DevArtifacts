package com.ubs.api.rest.jenkins.loader;

import com.ubs.api.rest.jenkins.model.QuoteEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableWebMvc
//@EnableJpaRepositories(basePackages = {"domain.repositories"})
@ComponentScan(basePackages = {"com.ubs.api.rest.jenkins"})
@PropertySources(value = {@PropertySource("classpath:application.properties")})
@EntityScan(basePackages = {"com.ubs.api.rest.jenkins.model"})
public class AppLoader {

    private static final Logger log = LoggerFactory.getLogger(AppLoader.class);

    public static void main(final String args[]) {
        SpringApplication.run(AppLoader.class);
    }

    @Bean
    public RestTemplate restTemplate(final RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public CommandLineRunner run(final RestTemplate restTemplate) throws Exception {
        return args -> {
            final QuoteEntity quoteEntity = restTemplate.getForObject("http://gturnquist-quoters.cfapps.io/api/random", QuoteEntity.class);
            log.info(quoteEntity.toString());
        };
    }
}