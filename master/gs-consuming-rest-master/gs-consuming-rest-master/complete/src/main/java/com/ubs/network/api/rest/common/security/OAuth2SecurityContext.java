package com.ubs.network.api.rest.common.security;

import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordResourceDetails;

import java.util.Arrays;

public class OAuth2SecurityContext {

    //    public OAuth2RestTemplate restTemplate() {
//        return new OAuth2RestTemplate(this.getAuthHeaders("mickey", "cheese"));
//    }
    public ResourceOwnerPasswordResourceDetails getAuthHeaders(final String username, final String password) {
        this.getAuthHeaders(username, password, Arrays.asList("read", "write"));
    }

    public ResourceOwnerPasswordResourceDetails getAuthHeaders(final String username, final String password, final List<String> scopes) {
        final ResourceOwnerPasswordResourceDetails resourceDetails = new ResourceOwnerPasswordResourceDetails();
        resourceDetails.setGrantType("password");
        resourceDetails.setAccessTokenUri("http://localhost:8080/oauth/token");
        resourceDetails.setClientId("quickpolliOSClient");
        resourceDetails.setClientSecret("top_secret");
        // Set scopes
        resourceDetails.setScope(scopes);

        // Resource Owner details
        resourceDetails.setUsername(username);
        resourceDetails.setPassword(password);
        return resourceDetails;
    }
}
