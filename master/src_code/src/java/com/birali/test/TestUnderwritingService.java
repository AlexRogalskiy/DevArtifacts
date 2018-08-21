package com.birali.test;

import junit.framework.TestCase;

import com.birali.domain.*;
import com.birali.engine.*;
import com.birali.services.*;

public class TestUnderwritingService extends TestCase {
	
	public void testSuccessfulApplication() throws Exception{	
		Borrower bo = new Borrower();
		bo.setAge(40);
		bo.setGrossIncome(290000.0);
		
		// Call the CreditScore Service to fill the credit score
		CreditScoringService css = new CreditScoringService();
		css.setScore(700); // Value hard-coded for testing purpose
		css.getScore(bo);
		
		// Call the affordability model service 
		AffordabilityModelService ams = new AffordabilityModelService();
		ams.runModel(bo);
				
		Property po = new Property();
		po.setPurpose(Flag.OWNER_OCCUPIED);
		po.setYearBuilt(2003);
		po.setZipCode("22102");
		
		// Call the PropertyValue service
		PropertyValuationService pvs = new PropertyValuationService();
		pvs.setPropertyValue(800000.0); // Value hard-coded for testing purpose
		pvs.getPropertyValue(po);		
		
		// Create a Loan Application
		LoanApplication la = new LoanApplication();
		la.setBorrower(bo);
		la.setProperty(po);
		la.setLoanAmount(390000.0);
		la.setLoanToValueRatio(la.getLoanAmount()/po.getValue()*100);

		// Calls the underwriting service		
		UnderwritingService ue = new UnderwritingService();
		ue.evaluate(la);

		System.out.println("\nTesting successful application");
		System.out.println("=============================");		
		System.out.println(la);
		System.out.println("Feedback message size=" + la.getFeedbackMsgSize());
		System.out.println("Affordability Flag=" + la.getAffordabilityFlag());
		System.out.println("Underwriting Decision=" + la.getStatus());
		
		//assertEquals(la.getStatus(), LoanApplication.PASSED);
		assertEquals(la.getStatus(), Flag.PASSED);
		
	}
	
	public void testAllFeedbackMessages() throws Exception{
		Borrower bo = new Borrower();
		bo.setAge(17);
		bo.setGrossIncome(170000.0);
		
		// Call the CreditScore Service to fill the credit score
		CreditScoringService css = new CreditScoringService();
		css.setScore(500);
		css.getScore(bo);
		
		// Call the affordability model service 
		AffordabilityModelService ams = new AffordabilityModelService();
		ams.runModel(bo);
				
		Property po = new Property();
		po.setPurpose(Flag.INVESTMENT);
		po.setYearBuilt(1961);
		po.setZipCode("22102");
		
		// Call the PropertyValue service
		PropertyValuationService pvs = new PropertyValuationService();
		pvs.setPropertyValue(800000.0);
		pvs.getPropertyValue(po);		
		
		// Create a Loan Application
		LoanApplication la = new LoanApplication();
		la.setBorrower(bo);
		la.setProperty(po);
		la.setLoanAmount(700000.0);
		la.setLoanToValueRatio(la.getLoanAmount()/po.getValue()*100);
		
		//	Calls the underwriting service
		UnderwritingService ue = new UnderwritingService();
		ue.evaluate(la);

		System.out.println("\nTesting all feedback messages");
		System.out.println("=============================");
		System.out.println(la);
		System.out.println("Feedback message size=" + la.getFeedbackMsgSize());
		System.out.println("Affordability Flag=" + la.getAffordabilityFlag());
		System.out.println("Underwriting Decision=" + la.getStatus());
		
		assertEquals(la.getStatus(), Flag.FAILED);
		
	}	
}
