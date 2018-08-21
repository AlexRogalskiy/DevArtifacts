package allcountry;

/*******************************************************************************
 * Autor    : felipe bessa
 * Email    : ffvechio@outlook.com
 * Data     : 02/02/2018
 *******************************************************************************/

import io.restassured.response.ValidatableResponse;
import org.hamcrest.Matchers;
import utils.PropertiesHelper;
import io.restassured.RestAssured;
import org.testng.annotations.Test;

import java.util.Properties;

import static io.restassured.RestAssured.given;

public class GetAllCountry {
    private Properties properties = new PropertiesHelper().getProperties();
    private ValidatableResponse statusMessage;


    @Test
    public void sendRequest() {
        RestAssured.baseURI = properties.getProperty("country") + "/get";
        statusMessage =
                given().request().
                        get("/all").
                        then().
                        statusCode(200).
                        assertThat().statusCode(200).
                        body("RestResponse.result.alpha3_code", Matchers.hasItems("PRT"));
    System.out.println(statusMessage);
    }
}