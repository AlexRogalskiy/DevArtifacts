package com.ubs.network.api.rest.common.security;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.http.HttpHeaders;

public class BasicAuthSecurityContext {

    public HttpHeaders getAuthHeaders(final String username, final String password) {
        String credentials = username + ":" + password;
        byte[] base64CredentialData = Base64.encodeBase64(credentials.getBytes());
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + new String(base64CredentialData));
        return headers;
    }

    public HttpHeaders getHeader(final String key, final String value) {
        final HttpHeader header = new HttpHeader();
        return header;
    }
}
