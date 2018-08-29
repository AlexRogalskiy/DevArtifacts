package ru.javabean.satellizer

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter

@Configuration
@ComponentScan
@EnableAutoConfiguration
@RestController
class Application extends WebMvcConfigurerAdapter {

    @RequestMapping("/pupa")
    def home(){
        return [chef:"purtrpae1"]
    }


    static void main(String[] args) {
        SpringApplication.run Application, args
    }
}
