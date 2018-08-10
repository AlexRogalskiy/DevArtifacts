package com.appinmaking.rest.controller;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.appinmaking.dto.rest.response.Response;

@RestController
public class DummyRestController {
	
	@RequestMapping(value="/check" ,method={RequestMethod.GET})
	public @ResponseBody Response check(){
		Response r = new Response();
		r.setStatus(0);
		r.setMessage("Successfully called");
		//r.setResults(new ArrayList<String>());
		return r;
	}

}
