package com.terry.springboot.helloworld;

public class Greeting {
	private final long id;
	private final String content;
	
	public Greeting(long id,String content){
		this.content = content;
		this.id = id;
	}
	
	public long getId(){
		return id;
	}
	public String getContents(){
		return content;
	}
}
