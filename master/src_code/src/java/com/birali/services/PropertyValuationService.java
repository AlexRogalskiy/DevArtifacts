package com.birali.services;

import com.birali.domain.*;

/* Run a model to create property valuation based on
 * various analytical methodologies and statistics. These statics
 * include prices of comparable houses in the neighborhood, 
 * characteristics of the house itself, historical property price 
 * appreciation
 */

public class PropertyValuationService {
	
	/* This is just a dummy service. 
	 * 
	 */ 
	
	private double propValue;
	
	public void setPropertyValue(double v){
		propValue = v;
	}
	
	public void getPropertyValue(Property prop){
		 prop.setValue(propValue);
	}

}
