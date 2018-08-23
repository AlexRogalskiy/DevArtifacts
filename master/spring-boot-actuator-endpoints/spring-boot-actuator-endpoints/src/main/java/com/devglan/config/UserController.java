package com.devglan.config;

import com.devglan.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Kusumitha K on 10-02-2017.
 */
@Controller
public class UserController {

    @RequestMapping(path = "user/{id}",method= RequestMethod.GET)
    public @ResponseBody User get(@PathVariable(name = "id", value = "id") String id) {
        return new User(id, "Dhiraj", "Ray", "Bangalore");
    }
}

