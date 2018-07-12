package com.javabeast.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
public class DeviceController {
    private static final String PAGE_NAME = "device";

    @GetMapping("device/{imei}")
    public ModelAndView getAngularFragment(@PathVariable final String imei, final HttpServletRequest httpServletRequest) {
        final Map<String, Object> model = new HashMap<>();
        model.put("imei", imei);
        //todo this should fetch the data for the imei on the device
        //only load devices allowed for this user etc
        return new ModelAndView(PAGE_NAME, model);
    }
}
