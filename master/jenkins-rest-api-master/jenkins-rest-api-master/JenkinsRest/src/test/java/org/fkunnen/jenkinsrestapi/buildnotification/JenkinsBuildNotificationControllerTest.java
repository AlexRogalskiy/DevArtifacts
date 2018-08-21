package org.fkunnen.jenkinsrestapi.buildnotification;

import com.jayway.restassured.RestAssured;
import org.fkunnen.jenkinsrestapi.Application;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;

import static com.jayway.restassured.RestAssured.given;
import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class, webEnvironment = RANDOM_PORT)
public class JenkinsBuildNotificationControllerTest {

    @Value("${local.server.port}")
    private int serverPort;

    @Before
    public void init(){
        RestAssured.port = serverPort;
        RestAssured.baseURI = "http://localhost" + ":" +  serverPort;
    }

    @Test
    public void testJenkinsFinishedBuildNotification() throws IOException, InterruptedException {
        String notificationJson = readFile("notification.json", UTF_8);

        given().contentType("application/json").body(notificationJson).when().post("/jenkins/buildnotification");

    }

    private String readFile(String path, Charset encoding) throws IOException
    {
        byte[] encoded = Files.readAllBytes(Paths.get("src/test/resources/" + path));
        return new String(encoded, encoding);
    }

}