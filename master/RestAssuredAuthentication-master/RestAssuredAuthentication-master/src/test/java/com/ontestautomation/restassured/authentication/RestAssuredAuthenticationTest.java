package com.ontestautomation.restassured.authentication;

import org.testng.ITestContext;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Test;

import com.jayway.restassured.path.json.JsonPath;

import static com.jayway.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class RestAssuredAuthenticationTest {

	@BeforeSuite
	public void requestToken(ITestContext context) {
		
		String response =
				given().
					parameters("grant_type","client_credentials").
					auth().
					preemptive().
					basic("AUyqLmmlHyX4Th7BdXpIN-sKu5rARNpWLNtQZabRneRp5eDrKEU5pdiNIOMgc-4OiNu4jX8VJwfwWr1a","ECFXJmz2yW0WDf0itUE13jgaBhLkF5kEV9pyzt8iK9vvWgoSBRQ0HCywNIqYftSwXmB6EH_KOGq0nO39").
				when().
					post("https://api.sandbox.paypal.com/v1/oauth2/token").
					asString();

		JsonPath jsonPath = new JsonPath(response);

		String accessToken = jsonPath.getString("access_token");
		
		context.setAttribute("accessToken", accessToken);

		System.out.println("Access token: " + context.getAttribute("accessToken"));
	}
	
	@Test
	public void checkUserInfoContainsUserId(ITestContext context) {
		
		System.out.println("Nanu print madtha idini..."+context.getAttribute("accessToken"));
		
		given().
			contentType("application/json").
			auth().
			oauth2(context.getAttribute("accessToken").toString()).
		when().
			get("https://api.sandbox.paypal.com/v1/identity/openidconnect/userinfo/?schema=openid").
		then().
			assertThat().
			body("",hasKey("user_id"));
	}

	@Test
	public void checkNumberOfAssociatedPaymentsIsEqualToZero(ITestContext context) {

		given().
			contentType("application/json").
			auth().
			oauth2(context.getAttribute("accessToken").toString()).
		when().
			get("https://api.sandbox.paypal.com/v1/payments/payment/").
		then().
			assertThat().
			body("count", equalTo(0));
	}
}
