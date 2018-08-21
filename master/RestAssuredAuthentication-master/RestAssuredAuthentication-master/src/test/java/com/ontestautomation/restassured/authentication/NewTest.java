package com.ontestautomation.restassured.authentication;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.testng.ITestContext;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.Test;
import org.testng.annotations.BeforeSuite;

public class NewTest {
	
	
  @Test
  public void f(ITestContext context) {
	  
	  System.out.println(context.getAttribute("driver"));
	  
	  WebDriver driver = (WebDriver) context.getAttribute("driver");
	  
	  driver.get("http://google.com");
	  driver.findElement(By.linkText("About")).click();
	  System.out.println(driver.getTitle());
	  
  }
  
  
  @BeforeSuite
  public void beforeSuite(ITestContext context) {
	  
	  WebDriver driver;
	  
	  driver = new FirefoxDriver();
	  
	  context.setAttribute("driver", driver);
	  	 	  
  }
  
  @AfterSuite
  public void afterSuite(ITestContext context){
	  
	  System.out.println("After Suite");
	  System.out.println("Get all test methods length: "+context.getAllTestMethods().length);
	  System.out.println("context.getPassedTests().getAllResults(): "+context.getPassedTests().getAllResults());
	  
	  WebDriver driver = (WebDriver) context.getAttribute("driver");
	  driver.quit();
  }

}
