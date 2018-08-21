package com.appinmaking.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/app")
public class AppWebController {

	@RequestMapping(method={RequestMethod.GET})
	public String home(){
		System.out.println("App container hit");
		return "home";
	}
}
