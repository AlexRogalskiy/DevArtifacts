package com.birali.services;

import com.birali.domain.*;

public class CreditScoringService {		
	// These is a dummy services. It is a wrapper service to any of 
	// the current credit scoring agency.
	
	private int bScore;
	
	public void setScore(int aScore){
		bScore = aScore;
	}
	
	public void getScore(Borrower bo){
		bo.setCreditScore(bScore);
	}

}
