package org.jenkinsci.plugins.jira_rest.jiraclient;

import java.net.URI;
import java.net.URISyntaxException;

import com.atlassian.jira.rest.client.api.JiraRestClient;
import com.atlassian.jira.rest.client.api.domain.User;
import com.atlassian.jira.rest.client.internal.async.AsynchronousJiraRestClientFactory;
import com.atlassian.util.concurrent.Promise;


public class JiraClientFactory {

    public static JiraAccess create(String url, String username, String password) throws URISyntaxException {

        URI jiraServerUri = new URI(url);

        final AsynchronousJiraRestClientFactory factory = new AsynchronousJiraRestClientFactory();
        final JiraRestClient jiraRestClient = factory.createWithBasicHttpAuthentication(jiraServerUri, username, password);

        return new JiraAccess() {
            public Promise<User> getEmailAddress(String username) {
                return jiraRestClient.getUserClient().getUser((String)null);
            }
        };

    }
}
