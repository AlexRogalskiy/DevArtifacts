package com.mkyong.without.optional;

public class DisplayFeatures {

	private String size; // In inches
	private ScreenResolution resolution;
	
	public DisplayFeatures(String size, ScreenResolution resolution){
		this.size = size;
		this.resolution = resolution;
	}
	
	public String getSize() {
		return size;
	}
	public ScreenResolution getResolution() {
		return resolution;
	}
	
}
