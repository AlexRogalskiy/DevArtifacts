package com.birali.domain;

import java.util.*;

public class LoanApplication {
				
	private double loanAmount;
	private int creditScore;
	private double loanToValueRatio;
	private Flag affordabilityFlag=Flag.AFFORDABLE;
	private int feedbackMsgSize;
	
	private Borrower borrower;
	private Property prop;
	
	private Flag status=Flag.PASSED;
	
	private ArrayList<String> feedbackMessages = new ArrayList<String>();
	
	public double getLoanAmount (){
		return loanAmount;
	}
	
	public void setLoanAmount(double p){
		loanAmount = p;
	}
	
	public double getCreditScore (){
		return creditScore;
	}
	
	public void setCreditScore(int p){
		creditScore = p;
	}	
	
	public double getLoanToValueRatio (){
		return loanToValueRatio;
	}
	
	public void setLoanToValueRatio(double p){
		loanToValueRatio = p;
	}
	
	public void setAffordabilityFlag(Flag p){
		affordabilityFlag = p;
	}
	public Flag getAffordabilityFlag(){
		return affordabilityFlag;
	}
	
	public Borrower getBorrower (){
		return borrower;
	}
	
	public void setBorrower(Borrower b){
		borrower = b;
	}
	
	public Property getProperty(){
		return prop;
	}
	
	public void setProperty(Property p){
		prop = p;
	}
	
	public Flag getStatus(){
		return status;
	}
	
	public void setStatus(Flag p){
		status = p;
	}
	
	
	public List<String> getFeedbackMessages(){
		return feedbackMessages;
	}
	
	public void addFeedbackMessage(String msg){
		feedbackMessages.add(msg);
		feedbackMsgSize = feedbackMessages.size();
	}
	public int getFeedbackMsgSize(){
		return feedbackMsgSize;
	}
	
	public String toString(){
		StringBuffer sb = new StringBuffer();
		for (String msg : feedbackMessages){
			sb.append(msg + "\n");
			//System.out.println(msg);
		}
		return sb.toString();
	}
	
}
