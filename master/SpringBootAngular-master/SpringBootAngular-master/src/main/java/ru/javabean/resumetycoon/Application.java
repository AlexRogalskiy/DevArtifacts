package ru.javabean.resumetycoon;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Sets;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import ru.javabean.resumetycoon.data.User;
import ru.javabean.resumetycoon.data.UserRepository;

import java.util.*;

@Configuration
@ComponentScan
@EnableAutoConfiguration
@RestController
@RequestMapping("/rest")
public class Application extends WebMvcConfigurerAdapter {

    @Autowired
    UserRepository repository;

    @RequestMapping("/stub")
    Map home() {
        return ImmutableMap.of("master", "chief");
    }

    @RequestMapping("/real")
    Object home1() {
        repository.deleteAll();
        repository.save(new User("admin", "admin", Sets.newHashSet("ROLE_ADMIN")));
        repository.save(new User("user", "user", Sets.newHashSet("ROLE_USER")));
        System.out.println("repository = " + repository.findByUsername("admin"));
        return Arrays.asList(ImmutableMap.of("master", "chief11111"), ImmutableMap.of("master", "chief31337"));
    }


    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}




