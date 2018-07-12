package com.javabeast;

import com.javabeast.ampq.AMPQConnection;
import com.javabeast.caching.Cache;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;
import reactor.spring.context.config.EnableReactor;




@SpringBootApplication
@EnableReactor

@EnableAutoConfiguration
@ComponentScan
@EnableCaching
@EnableJpaRepositories
@Import({AMPQConnection.class, Cache.class})
public class Application {

    public static void main(String[] args) throws InterruptedException {
        final ApplicationContext ctx = SpringApplication.run(Application.class);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}