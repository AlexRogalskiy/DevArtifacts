package com.appinmaking.dto.rest.response;

import java.util.List;

public class Response {
	private int status;
	private String message;
	//private List results;
	
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	/*public List getResults() {
		return results;
	}
	public void setResults(List results) {
		this.results = results;
	}*/
}
