/*
 * #%L
 * Jenkins Java API
 * %%
 * Copyright (C) 2013 Daniel Pacak
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package com.github.danielpacak.jenkins.ci.core.client;

import static com.github.danielpacak.jenkins.ci.core.util.Preconditions.checkArgumentNotNull;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;

import com.github.danielpacak.jenkins.ci.core.http.HttpHeaders;
import com.github.danielpacak.jenkins.ci.core.http.HttpMethod;
import com.github.danielpacak.jenkins.ci.core.http.HttpStatus;
import com.github.danielpacak.jenkins.ci.core.http.client.ClientHttpRequest;
import com.github.danielpacak.jenkins.ci.core.http.client.ClientHttpRequestFactory;
import com.github.danielpacak.jenkins.ci.core.http.client.ClientHttpResponse;
import com.github.danielpacak.jenkins.ci.core.http.client.DefaultResponseErrorHandler;
import com.github.danielpacak.jenkins.ci.core.http.client.ResponseErrorHandler;
import com.github.danielpacak.jenkins.ci.core.http.client.SimpleClientHttpRequestFactory;
import com.github.danielpacak.jenkins.ci.core.http.converter.BuildHttpMessageConverter;
import com.github.danielpacak.jenkins.ci.core.http.converter.GroovyResponseHttpMessageConverter;
import com.github.danielpacak.jenkins.ci.core.http.converter.GroovyScriptHttpMessageConverter;
import com.github.danielpacak.jenkins.ci.core.http.converter.HttpMessageConverter;
import com.github.danielpacak.jenkins.ci.core.http.converter.JenkinsHttpMessageConverter;
import com.github.danielpacak.jenkins.ci.core.http.converter.JobArrayHttpMessageConverter;
import com.github.danielpacak.jenkins.ci.core.http.converter.JobConfigurationHttpMessageConverter;
import com.github.danielpacak.jenkins.ci.core.http.converter.JobHttpMessageConverter;
import com.github.danielpacak.jenkins.ci.core.http.converter.PluginArrayHttpMessageConverter;

/**
 * Client class for interacting with the Jenkins HTTP/XML API.
 * 
 * @since 1.0.0
 */
public class JenkinsClient {

   private static final String DEFAULT_URL_SCHEME = "http";

   public static final String DEFAULT_URL_HOST = "localhost";

   public static final int DEFAULT_URL_PORT = 8080;

   public static final String SEGMENT_JOB = "/job";

   public static final String SEGMENT_CREATE_ITEM = "/createItem";

   public static final String SEGMENT_DO_DELETE = "/doDelete";

   public static final String SEGMENT_API_XML = "/api/xml";

   public static final String SEGMENT_CONFIG_XML = "/config.xml";

   public static final String SEGMENT_SCRIPT_TEXT = "/scriptText";

   public static final String DEFAULT_USER_AGENT = "JenkinsJavaAPI";

   private ClientHttpRequestFactory clientHttpRequestFactory;

   private ResponseErrorHandler responseErrorHandler;

   private List<HttpMessageConverter<?>> messageConverters;

   private String baseUri;

   /**
    * Create a new client for the default scheme {@value #DEFAULT_URL_SCHEME}, default host {@value #DEFAULT_URL_HOST},
    * and the default port {@value #DEFAULT_URL_PORT}.
    */
   public JenkinsClient() {
      this(DEFAULT_URL_HOST, DEFAULT_URL_PORT);
   }

   /**
    * Create a new client for the default scheme {@value #DEFAULT_URL_SCHEME} and the given host and port.
    * 
    * @param host the host
    * @param port the port
    * @throws IllegalArgumentException if the host or port is {@code null}
    * @since 1.0.0
    */
   public JenkinsClient(String host, Integer port) {
      this(DEFAULT_URL_SCHEME, host, port, null);
   }

   /**
    * Create a new client for the given scheme, host, port, and prefix.
    * 
    * @param scheme the scheme
    * @param host the host
    * @param port the port
    * @param prefix the prefix
    * @throws IllegalArgumentException if the scheme, host, or port is {@code null}
    * @since 1.0.0
    */
   public JenkinsClient(String scheme, String host, Integer port, String prefix) {
      checkArgumentNotNull(scheme, "Scheme cannot be null");
      checkArgumentNotNull(host, "Host cannot be null");
      checkArgumentNotNull(port, "Port cannot be null");
      // @formatter:off
      StringBuilder uri = new StringBuilder()
         .append(scheme)
         .append("://")
         .append(host)
         .append(':')
         .append(port);
      // @formatter:on
      this.baseUri = prefix != null ? uri.append(prefix).toString() : uri.toString();

      this.clientHttpRequestFactory = new SimpleClientHttpRequestFactory();
      this.responseErrorHandler = new DefaultResponseErrorHandler();

      this.messageConverters = new LinkedList<HttpMessageConverter<?>>();
      this.messageConverters.add(new JobHttpMessageConverter());
      this.messageConverters.add(new JobArrayHttpMessageConverter());
      this.messageConverters.add(new JobConfigurationHttpMessageConverter());
      this.messageConverters.add(new JenkinsHttpMessageConverter());
      this.messageConverters.add(new PluginArrayHttpMessageConverter());
      this.messageConverters.add(new BuildHttpMessageConverter());
      this.messageConverters.add(new GroovyScriptHttpMessageConverter());
      this.messageConverters.add(new GroovyResponseHttpMessageConverter());

      this.clientHttpRequestFactory.setUserAgent(DEFAULT_USER_AGENT);
   }

   public <T> T getForObject(String uri, Class<T> responseType) {
      ResponseExtractor<T> responseExtractor = new HttpMessageConverterResponseExtractor<T>(responseType,
            messageConverters);
      return execute(newURI(baseUri + uri), HttpMethod.GET, null, responseExtractor);
   }

   public URI postForLocation(String uri, Object request) {
      RequestCallback requestCallback = new HttpMessageCoverterRequestCallback(request, messageConverters);
      HttpHeadersResponseExtractor responseExtractor = new HttpHeadersResponseExtractor();
      return execute(newURI(baseUri + uri), HttpMethod.POST, requestCallback, responseExtractor).getLocation();
   }

   public <T> T postForObject(String uri, Object request, Class<T> responseType) {
      RequestCallback requestCallback = new HttpMessageCoverterRequestCallback(request, messageConverters);
      ResponseExtractor<T> responseExtractor = new HttpMessageConverterResponseExtractor<T>(responseType,
            messageConverters);
      return execute(newURI(baseUri + uri), HttpMethod.POST, requestCallback, responseExtractor);
   }

   protected <T> T execute(URI url, HttpMethod method, RequestCallback requestCallback,
         ResponseExtractor<T> responseExtractor) throws JenkinsClientException {
      ClientHttpResponse response = null;
      try {
         ClientHttpRequest request = clientHttpRequestFactory.createRequest(url, method);
         if (requestCallback != null) {
            requestCallback.doWithRequest(request);
         }

         response = request.execute();

         if (getResponseErrorHandler().hasError(response)) {
            getResponseErrorHandler().handleError(response);
         }
         if (responseExtractor != null) {
            return responseExtractor.extract(response);
         } else {
            return null;
         }
      } catch (IOException e) {
         throw new ResourceAccessException("I/O error on " + method.name() + " request for \"" + url + "\": "
               + e.getMessage(), e);
      } finally {
         if (response != null) {
            response.close();
         }
      }
   }

   /**
    * Set credentials for the basic access authentication.
    * <p>
    * The credentials are sent as the {@value HttpHeaders#HEADER_AUTHORIZATION} HTTP request header. The header is
    * constructed as follows:
    * <ul>
    * <li>User and password are combined into a string "user:password"</li>
    * <li>The resulting string is encoded using Base64</li>
    * <li>The authorization method and a space i.e. "Basic " is then put before the encoded string.</li>
    * </ul>
    * For example, if the user is 'dpacak' and the password is 'passw0rd' then the header is formed as follows:
    * 
    * <pre>
    * {@code Authentication: Basic ZHBhY2FrOnBhc3N3MHJk}
    * </pre>
    * 
    * The basic access authentication mechanism provides <b>no confidentiality protection</b> for the transmitted
    * credentials. They are merely encoded with Base64 in transit, but not encrypted or hashed in any way. It is,
    * therefore, typically used over HTTPS.
    * 
    * @param user the user
    * @param password the password
    * @return this client
    * @throws IllegalArgumentException if the user or password is {@code null}
    * @see <a href="http://en.wikipedia.org/wiki/Basic_access_authentication">Basic access authentication</a>
    * @since 1.0.0
    */
   public JenkinsClient setCredentials(String user, String password) {
      checkArgumentNotNull(user, "User cannot be null");
      checkArgumentNotNull(password, "Password cannot be null");
      getClientHttpRequestFactory().setCredentials(user, password);
      return this;
   }

   /**
    * Set the identifier of this client which is sent as the value of the {@link HttpHeaders#USER_AGENT} HTTP request
    * header. The default identifier is {@value #DEFAULT_USER_AGENT}.
    * 
    * @param userAgent the identifier
    * @return this client
    * @throws IllegalArgumentException if the identifier is {@code null}
    * @since 1.0.0
    */
   public JenkinsClient setUserAgent(String identifier) {
      checkArgumentNotNull(identifier, "Identifier cannot be null");
      getClientHttpRequestFactory().setUserAgent(identifier);
      return this;
   }

   public ClientHttpRequestFactory getClientHttpRequestFactory() {
      return clientHttpRequestFactory;
   }

   public void setClientHttpRequestFactory(ClientHttpRequestFactory clientHttpRequestFactory) {
      this.clientHttpRequestFactory = clientHttpRequestFactory;
   }

   /**
    * Get response error handler.
    * 
    * @return error handler
    */
   public ResponseErrorHandler getResponseErrorHandler() {
      return responseErrorHandler;
   }

   /**
    * Set the response error handler.
    * <p>
    * By default, {@code JenkinsClient} uses a {@link DefaultResponseErrorHandler}.
    * 
    * @param responseErrorHandler error handler
    */
   public JenkinsClient setResponseErrorHandler(ResponseErrorHandler responseErrorHandler) {
      this.responseErrorHandler = responseErrorHandler;
      return this;
   }

   public List<HttpMessageConverter<?>> getMessageConverters() {
      return messageConverters;
   }

   public void setMessageConverters(List<HttpMessageConverter<?>> messageConverters) {
      this.messageConverters = messageConverters;
   }

   private URI newURI(String uri) {
      try {
         return new URI(uri);
      } catch (URISyntaxException e) {
         throw new IllegalArgumentException("Invalid uri [" + uri + "]", e);
      }
   }

   /**
    * Response extractor that extracts the response {@link HttpHeaders headers}.
    */
   private class HttpHeadersResponseExtractor implements ResponseExtractor<HttpHeaders> {
      @Override
      public HttpHeaders extract(ClientHttpResponse response) throws IOException {
         return response.getHeaders();
      }
   }

   /**
    * Response extractor that uses the given {@linkplain HttpMessageConverter message converters} to convert the HTTP
    * response into an instance of type {@code T}.
    */
   private class HttpMessageConverterResponseExtractor<T> implements ResponseExtractor<T> {

      private final Class<T> responseClass;

      private final List<HttpMessageConverter<?>> messageConverters;

      public HttpMessageConverterResponseExtractor(Class<T> responseClass,
            List<HttpMessageConverter<?>> messageConverters) {
         this.responseClass = responseClass;
         this.messageConverters = messageConverters;
      }

      @SuppressWarnings({ "rawtypes", "unchecked" })
      @Override
      public T extract(ClientHttpResponse response) throws IOException {
         if (!hasMessageBody(response)) {
            return null;
         }

         for (HttpMessageConverter messageConverter : this.messageConverters) {
            if (messageConverter.canRead(responseClass)) {
               return (T) messageConverter.read(responseClass, response);
            }
         }
         throw new JenkinsClientException(
               "Could not read response: no suitable HttpMessageConverter found for response type ["
                     + this.responseClass.getName() + "]");
      }

      protected boolean hasMessageBody(ClientHttpResponse response) throws IOException {
         HttpStatus responseStatus = response.getStatusCode();
         if (responseStatus == HttpStatus.NO_CONTENT || responseStatus == HttpStatus.NOT_MODIFIED) {
            return false;
         }
         long contentLength = response.getHeaders().getContentLength();
         return contentLength != 0;
      }
   }

   /**
    * Request callback that uses the given {@linkplain HttpMessageConverter message converters} to write the given
    * object to the HTTP request stream.
    */
   private class HttpMessageCoverterRequestCallback implements RequestCallback {

      private final Object requestBody;

      private List<HttpMessageConverter<?>> messageConverters;

      public HttpMessageCoverterRequestCallback(Object requestBody, List<HttpMessageConverter<?>> messageConverters) {
         this.requestBody = requestBody;
         this.messageConverters = messageConverters;
      }

      @SuppressWarnings({ "rawtypes", "unchecked" })
      @Override
      public void doWithRequest(ClientHttpRequest request) throws IOException {
         if (requestBody == null) {
            return;
         }
         for (HttpMessageConverter messageConverter : messageConverters) {
            if (messageConverter.canWrite(requestBody.getClass())) {
               messageConverter.write(requestBody, null, request);
               return;
            }
         }
         throw new JenkinsClientException(
               "Could not write request: no suitable HttpMessageConverter found for request type ["
                     + requestBody.getClass().getName() + "]");
      }

   }

}
