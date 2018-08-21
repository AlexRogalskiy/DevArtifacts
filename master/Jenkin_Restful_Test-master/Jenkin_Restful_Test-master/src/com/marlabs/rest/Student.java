/**
 * 
 */
package com.marlabs.rest;

import java.io.File;

import org.codehaus.jackson.map.ObjectMapper;

/**
 * @author nandakumarv
 *
 */
public class Student {
	
	int id;
	String firstName;
	String lastName;
	int age;
	
	public Student() {
		
	}
	
	/**
	 * @param id
	 * @param firstName
	 * @param lastName
	 * @param age
	 */
	public Student(String firstName, String lastName, int id, int age) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.age = age;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	
		
	@Override
	public String toString() {
		/*return new StringBuffer("\"First Name\": ").append(this.firstName)
				.append(" Last Name : ").append(this.lastName)
				.append(" Age : ").append(this.age).append(" ID : ")
				.append(this.id).toString();*/
		//return "{\"First name\" : \"" + this.firstName + "\"}";
		String output = "";
		ObjectMapper mapper = new ObjectMapper();
		
		try{
		// convert user object to json string, and save to a file
		mapper.writeValue(new File("user.json"), this);
		 
		// display to console
			output = mapper.writeValueAsString(this);
		} catch(Exception e) {
			e.printStackTrace();
		}
		return output;
	}
	

}
