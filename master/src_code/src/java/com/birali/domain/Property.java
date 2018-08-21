package com.birali.domain;

public class Property {
	private Flag type;
	private Flag purpose;
	private String zipCode;
	private int yearBuilt;
	private double value;
	
	public void setType(Flag p){
		this.type = p;
	}
	
	public Flag getType(){
		return type;
	}

	public void setPurpose(Flag p){
		this.purpose = p;
	}
	
	public Flag getPurpose(){
		return purpose;
	}
		
	public void setZipCode(String p){
		this.zipCode = p;
	}
	
	public String getZipCode(){
		return zipCode;
	}	
	
	public void setYearBuilt(int p){
		this.yearBuilt = p;
	}
	
	public int getYearBuilt(){
		return yearBuilt;
	}
	public double getValue(){
		return value;
	}
	public void setValue(double p){
		value = p;
	}
}
