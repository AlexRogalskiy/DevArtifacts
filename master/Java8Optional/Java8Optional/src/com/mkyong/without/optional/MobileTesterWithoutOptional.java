package com.mkyong.without.optional;

public class MobileTesterWithoutOptional {
	
	public static void main(String[] args) {
		ScreenResolution resolution = new ScreenResolution(750,1334);
		DisplayFeatures dfeatures = new DisplayFeatures("4.7", resolution);
		Mobile mobile = new Mobile(2015001, "Apple", "iPhone 6s", dfeatures);
		
		MobileService mService = new MobileService();
		
		int mobileWidth = mService.getMobileScreenWidth(mobile);
		System.out.println("Apple iPhone 6s Screen Width = " + mobileWidth);
		
		ScreenResolution resolution2 = new ScreenResolution(0,0);
		DisplayFeatures dfeatures2 = new DisplayFeatures("0", resolution2);
		Mobile mobile2 = new Mobile(2015001, "Apple", "iPhone 6s", dfeatures2);		
		int mobileWidth2 = mService.getMobileScreenWidth(mobile2);
		System.out.println("Apple iPhone 16s Screen Width = " + mobileWidth2);

	}

}
