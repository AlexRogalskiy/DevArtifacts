package com.birali.services;

import com.birali.domain.Borrower;

public class AffordabilityModelService {
	/*   This service calculates the loan amount that an applicant can afford on 
	 *   the basis of an assessment of the main components of income and expenditure.)
	 *   For simplicity, we just enter dummy values
	 */
		
	public void runModel(Borrower bo){
		bo.setAffordableLoanAmount(4.72*bo.getGrossIncome());
	}

}
