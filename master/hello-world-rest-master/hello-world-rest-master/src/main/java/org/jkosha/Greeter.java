package org.jkosha;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Greeter {

    @RequestMapping("/")
    public String sayHello() {
        return "Hello!";
    }
}
