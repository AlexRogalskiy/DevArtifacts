package com.mujahidk.api.jenkins;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

public class RestTestSteps {

    private CloseableHttpClient httpclient;
    private HttpGet httpGet;
    private String result;

    @Given("^Our API is located at \\#(.*)\\#$")
    public void url_http(String url) throws Throwable {
        // Create the client and prepare the Get request
        httpclient = HttpClients.createDefault();
        httpGet = new HttpGet(url);
    }

    @When("^The data is fetched$")
    public void url_is_fetched() throws Throwable {
        // Get the data from the Given URL
        CloseableHttpResponse response = httpclient.execute(httpGet);
        try {
            HttpEntity entity = response.getEntity();
            // Get the JSON contents as String
            result = EntityUtils.toString(entity);
        } finally {
            response.close();
        }
    }

    @Then("^The API result should contain project name '(.*)'$")
    public void it_should_contain_the_json_result(String name) throws Throwable {
        // Create Jackson mapper to convert String JSON to JenkingsProject pojo
        ObjectMapper mapper = new ObjectMapper();
        // Ignore properties which are not defined in JenkingsProject pojo
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        // Read the JSON into JenkingsProject pojo
        JenkinsProject project = mapper.readValue(result, JenkinsProject.class);
        // Assert the contents
        assertThat(project.getName(), equalTo(name));
    }

    // Pojo to represent the JenkinsProject information
    static class JenkinsProject {
        private String displayName;
        private String url;
        private String name;

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
