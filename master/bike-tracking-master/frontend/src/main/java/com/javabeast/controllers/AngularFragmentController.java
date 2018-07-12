package com.javabeast.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
public class AngularFragmentController {
    private static final String FRAGMENTS_URL = "fragments/";

    @GetMapping("fragments/{pageName}")
    public ModelAndView getAngularFragment(@PathVariable final String pageName, final HttpServletRequest httpServletRequest) {
        final Map<String, Object> model = new HashMap<>();
        final String viewName = FRAGMENTS_URL + pageName;
        return new ModelAndView(viewName, model);
    }
}
