package basic;

import static io.restassured.RestAssured.given;

import io.restassured.path.json.JsonPath;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import static org.hamcrest.Matchers.equalTo;

public class PostAndRead {

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
    public void postTweet() {
        Response rss = given()
                .auth()
                .oauth(consumerKey, consumerSecret, accessToken, accessTokenSecret)
                .queryParam("status", "Hello USA!!!!!")
                .when()
                .post("/update.json")
                .then()
                .statusCode(200)
                .extract().response();
        tweetId = rss.path("id_str");
        System.out.println(tweetId);

//        String rssString = rss.asString();
//        System.out.println(rssString);
//        JsonPath jsPath = new JsonPath(rssString);
//        String name = jsPath.get("user.name");
//        System.out.println(name);
    }
    @Test(dependsOnMethods = {"postTweet"})
    public void showTweet() {
        Response rss = given()
                .auth()
                .oauth(consumerKey, consumerSecret, accessToken, accessTokenSecret)
                .queryParam("id", tweetId)
                .when()
                .get("/show.json")
                .then()
                .statusCode(200)
                .extract().response();
        String text = rss.path("text");
        System.out.println(text);

    }
    @Test(dependsOnMethods = {"showTweet"})
    public void deleteTweet() {
       given()
                .auth()
                .oauth(consumerKey, consumerSecret, accessToken, accessTokenSecret)
                .queryParam("id", tweetId)
                .when()
                .post("/destroy.json")
                .then()
                .statusCode(200);

    }
}