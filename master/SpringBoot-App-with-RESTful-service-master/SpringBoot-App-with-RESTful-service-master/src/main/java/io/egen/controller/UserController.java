package io.egen.controller;

import java.util.List;


import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.egen.entity.User;
import io.egen.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;



@RestController
@RequestMapping(value = "/users")
@Api(tags = "users")
public class UserController {
	

	private UserService service;
	
	 public UserController(UserService service) {
		this.service = service;
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET)
	@ApiOperation(value = "Find All Users", notes = "Returns a list of users in the app")
	@ApiResponses(value = { 
			@ApiResponse(code = 200, message = "Success"),
			@ApiResponse(code = 500, message = "Internal Server Error"), 
			})
	public List<User> findAll()
	{	
		return service.findAll();
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/{id}")
	@ApiOperation(value = "Find User by Id", notes = "Returns a user by id if it exists in the app")
	@ApiResponses(value = { 
			@ApiResponse(code = 200, message = "Success"),
			@ApiResponse(code = 404, message = "Not Found"),
			@ApiResponse(code = 500, message = "Internal Server Error"), 
			})
	public User findOne(@PathVariable("id") String id)
	{
		return service.findOne(id);
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST)
	@ApiOperation(value = "Create User", notes = "Creates a user in the app with unique email")
	@ApiResponses(value = { 
			@ApiResponse(code = 200, message = "Success"),
			@ApiResponse(code = 400, message = "Bad Request"),
			@ApiResponse(code = 500, message = "Internal Server Error"), 
			})
	public User create(@RequestBody User user)
	{
		return service.create(user);
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.PUT, value = "/{id}")
	@ApiOperation(value = "Update User", notes = "Updates an existing user")
	@ApiResponses(value = { 
			@ApiResponse(code = 200, message = "Success"),
			@ApiResponse(code = 404, message = "Not Found"),
			@ApiResponse(code = 500, message = "Internal Server Error"), 
			})
	public User update(@PathVariable("id") String id, @RequestBody User user)
	{
		return service.update(id, user);
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/{id}")
	@ApiOperation(value = "Delete User", notes = "Deletes an existing user")
	@ApiResponses(value = { 
			@ApiResponse(code = 200, message = "Success"),
			@ApiResponse(code = 404, message = "Not Found"),
			@ApiResponse(code = 500, message = "Internal Server Error"), 
			})
	public void delete(@PathVariable("id") String id)
	{
		service.delete(id);
	}

}
