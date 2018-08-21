package basic;
import io.restassured.RestAssured;
import static io.restassured.RestAssured.given;

import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import static org.hamcrest.Matchers.equalTo;
public class RestAssuredPractice {

    @BeforeClass
    public void setUp(){
        RestAssured.baseURI = "https://maps.googleapis.com";
        RestAssured.basePath = "/maps/api";
    }

    @Test
    public void statusCodeVerification(){
        given()
                .param("units", "imperial")
                .param("origins", "Washington,DC")
                .param("destinations", "New+York+City,NY")
                .param("key", "AIzaSyBCeAPQbptsjb0819jbA5YXF5F1KiDHhGA")
         .when()
                .get("/distancematrix/json")
         .then()
                .statusCode(200)
                .and()
                .body("rows[0].elements[0].distance.text", equalTo("225 mi")).contentType(ContentType.JSON);

    }
    @Test
    public void getBodyResponse(){
        Response res = given()
                .param("units", "imperial")
                .param("origins", "Washington,DC")
                .param("destinations", "New+York+City,NY")
                .param("key", "AIzaSyBCeAPQbptsjb0819jbA5YXF5F1KiDHhGA")
         .when()
                .get("/distancematrix/json");
        System.out.println(res.body().prettyPrint());
    }
}
