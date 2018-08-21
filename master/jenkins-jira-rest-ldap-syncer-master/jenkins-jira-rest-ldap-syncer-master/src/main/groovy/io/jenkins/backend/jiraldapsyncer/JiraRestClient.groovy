/*
 * The MIT License
 *
 * Copyright (c) 2016, CloudBees, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
package io.jenkins.backend.jiraldapsyncer

import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseDecorator
import org.apache.commons.logging.Log
import org.apache.commons.logging.LogFactory
import org.apache.http.HttpRequest
import org.apache.http.HttpRequestInterceptor
import org.apache.http.HttpResponse
import org.apache.http.impl.client.DefaultRedirectStrategy
import org.apache.http.protocol.HttpContext

import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.DELETE
import static groovyx.net.http.Method.POST


public class JiraRestClient {
    public static final String ROLE = "jiraRestClient"

    private static final Log LOG = LogFactory.getLog(JiraRestClient.class)

    // jira credentials
    String adminLogin
    String adminPassword

    String defaultGroup
    String inactiveGroup

    private HTTPBuilder httpBuilder

    public JiraRestClient(String adminLogin, String adminPassword, String url) {
        this.adminLogin = adminLogin
        this.adminPassword = adminPassword
        this.httpBuilder = getHttp(url)
    }

    public Map<String,RemoteUser> getAllUsers() {
        return getUsers(defaultGroup)
    }

    public Map<String,RemoteUser> getInactiveUsers() {
        return getUsers(inactiveGroup)
    }

    public RemoteUser getUser(String id) {
        def user

        httpBuilder.get(path: "/rest/api/2/user", query: [username: id]) { resp, json ->
            if (resp.status == 200) {
                user = new RemoteUser(email: json.emailAddress, fullname: json.displayName, name: json.name.toLowerCase())
            }
        }

        return user
    }

    public String getGroup(String group) {
        String groupName
        httpBuilder.get(path: "/resp/api/2/group/member",
            query: [groupname: group, maxResults: 1]) { resp, json ->
            if (resp.status != 200) {
                groupName = createGroup(group)
            } else {
                groupName = group
            }
        }
        return groupName
    }

    public boolean createUser(RemoteUser user) {
        boolean success = false
        if (user.isValidUser()) {
            httpBuilder.request(POST, JSON){ req ->
                uri.path = "/rest/api/2/user"
                body = ["name": user.name,
                        "emailAddress": user.email,
                        "displayName": user.fullname]

                response.success = { resp ->
                    success = true
                }

                response.failure = { HttpResponseDecorator resp, json ->
                    LOG.error("createUser response error: ${resp.allHeaders} - ${json}")
                }
            }
        }

        return success
    }

    public void addUserToGroup(RemoteUser user, String group) {
        String actualGroup = getGroup(group)

        if (actualGroup == null) {
            LOG.error("Couldn't find or create group so failing")
        } else {
            httpBuilder.request(POST, JSON) { req ->
                uri.path = "/rest/api/2/group/user"
                query = ["groupname": actualGroup]
                body = ["name": user.name]

                response.failure = { HttpResponseDecorator resp, json ->
                    LOG.error("addUserToGroup response error: ${resp.allHeaders} - ${json}")
                }
            }
        }
    }

    public void removeUserFromGroup(RemoteUser user, String group) {
        httpBuilder.request(DELETE, JSON) { req ->
            uri.path = "/rest/api/2/group/user"
            query = ["groupname": group, "username": user.name]

            response.failure = { HttpResponseDecorator resp, json ->
                LOG.error("removeUserFromGroup response error: ${resp.allHeaders} - ${json}")
            }
        }
    }

    public String createGroup(String group) {
        String groupName
        httpBuilder.request(POST, JSON) { req ->
            uri.path = "/rest/api/2/group"
            body = ["name": group]

            response.success = { resp, json ->
                groupName = json.name
            }
            response.failure = { HttpResponseDecorator resp, json ->
                LOG.error("createGroup response error: ${resp.allHeaders} - ${json}")
            }
        }

        return groupName
    }

    private Map<String,RemoteUser> getUsers(String group) {
        return getAllPagesOfQuery("group/member", [ groupname: group ]).collectEntries { rawUser ->
            ["${rawUser.name.toLowerCase()}":
                 new RemoteUser(email: rawUser.emailAddress, fullname: rawUser.displayName, name: rawUser.name.toLowerCase())]
        }
    }

    private List<Map<String,Object>> getAllPagesOfQuery(String api, Map<String,Object> baseParams) {
        String baseQuery = "/rest/api/2/${api}"

        boolean isLast = false
        int startIndex = 0

        def values = []

        while (!isLast) {
            def params = [:]
            params.putAll(baseParams)
            params.put("startAt", startIndex)

            httpBuilder.get(path: baseQuery,
                query: params) { resp, json ->
                if (resp.status != 200) {
                    // Error, we're done.
                    isLast = true
                } else {
                    values.addAll(json.values)
                    isLast = json.isLast
                }
            }
        }

        return values
    }

    private getHttp(String url) {

        def http = new HTTPBuilder(url)
        http.client.addRequestInterceptor(new HttpRequestInterceptor() {
            void process(HttpRequest httpRequest, HttpContext httpContext) {
                httpRequest.addHeader('Authorization', 'Basic ' + "${adminLogin}:${adminPassword}".toString().bytes.encodeBase64().toString())
            }
        })
        http.client.setRedirectStrategy(new DefaultRedirectStrategy() {
            @Override
            boolean isRedirected(HttpRequest request, HttpResponse response, HttpContext context) {
                def redirected = super.isRedirected(request, response, context)
                return redirected || response.getStatusLine().getStatusCode() == 302
            }
        })
        http.ignoreSSLIssues()
        return http

    }


}
