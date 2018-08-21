package basic;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.concurrent.TimeUnit;

import static org.hamcrest.Matchers.*;

import static io.restassured.RestAssured.given;

public class RestAssertion {

    String consumerKey = "N3qmmnjgLMmdHzzKNcuwAnP6S";
    String consumerSecret = "7wZ6sbpFhwcgiC2BtlcDzzTdR2HG4VSFeTm98xj2P9ul0vxAgR";
    String accessToken = "908755131524624386-BfwWmCPqiKAD7a4pPZ7ahUhCVGCf4mr";
    String accessTokenSecret = "lG6XFAk3xujstFfKYc7lMLtKqfEWSj2gt6OeVNTKRFBEB";
    String tweetId = "";

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.twitter.com";
        RestAssured.basePath = "/1.1/statuses";
    }

    @Test
    public void restAssertion() {
//        long ResponseTime =
                given()
                        .auth()
                        .oauth(consumerKey, consumerSecret, accessToken, accessTokenSecret)
                        .queryParam("user_id", "Sukanta50838068")
                .when()
                        .get("/user_timeline.json")
                .then()
                        .statusCode(200)
                        .time(lessThan(3L), TimeUnit.SECONDS)
                        .log()
                        .body()
                        .body("text", hasItem("test tweet"));

    }

}