package basic;

import static io.restassured.RestAssured.given;

import io.restassured.path.json.JsonPath;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import static org.hamcrest.Matchers.equalTo;

public class PostRequest {

    String consumerKey = "N3qmmnjgLMmdHzzKNcuwAnP6S";
    String consumerSecret = "7wZ6sbpFhwcgiC2BtlcDzzTdR2HG4VSFeTm98xj2P9ul0vxAgR";
    String accessToken = "908755131524624386-BfwWmCPqiKAD7a4pPZ7ahUhCVGCf4mr";
    String accessTokenSecret = "lG6XFAk3xujstFfKYc7lMLtKqfEWSj2gt6OeVNTKRFBEB";

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.twitter.com";
        RestAssured.basePath = "/1.1/statuses";
    }

    @Test
    public void statusCodeVerification() {
      Response rss = given()
               .auth()
               .oauth(consumerKey, consumerSecret, accessToken, accessTokenSecret)
               .queryParam("status", "Happy Holiday")
       .when()
               .post("/update.json")
        .then()
              .statusCode(200)
              .extract().response();
      String id = rss.path("id_str");
        System.out.println(id);

        String rssString = rss.asString();
        System.out.println(rssString);
        JsonPath jsPath = new JsonPath(rssString);
        String name = jsPath.get("user.name");
        System.out.println(name);


    }
}