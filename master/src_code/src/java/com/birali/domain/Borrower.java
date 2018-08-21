package com.birali.domain;

public class Borrower {
	int age;
	double setAffordableLoanAmount;
	double grossIncome;
	int creditScore;
	
	public void setAge(int p){
		age = p;
	}
	
	public int getAge(){
		return age;
	}
		
	public void setAffordableLoanAmount(double p){
		setAffordableLoanAmount = p;
	}
	public double getAffordableLoanAmount(){
		return setAffordableLoanAmount;
	}
		
	public double getGrossIncome(){
		return grossIncome;
	}
	public void setGrossIncome(double p){
		grossIncome = p;
	}
	
	public int getCreditScore(){
		return creditScore;
	}
	public void setCreditScore(int p){
		creditScore = p;
	}	
}
