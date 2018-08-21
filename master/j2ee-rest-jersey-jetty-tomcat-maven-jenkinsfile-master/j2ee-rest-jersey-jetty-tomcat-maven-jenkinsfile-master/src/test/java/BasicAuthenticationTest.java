import static junit.framework.Assert.assertEquals;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.internal.util.Base64;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Test;

import java.io.IOException;
import java.nio.charset.Charset;
import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Priority;
import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Priorities;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.Provider;
import javax.xml.bind.DatatypeConverter;

/**
 * http://stackoverflow.com/questions/32817210/how-to-access-jersey-resource-secured-by-rolesallowed
 * 
 * @author <a href="http://stackoverflow.com/users/2587435/peeskillet">peeskillet</a>
 *
 */
public class BasicAuthenticationTest extends JerseyTest {

  @Provider
  @Priority(Priorities.AUTHENTICATION)
  public static class BasicAuthFilter implements ContainerRequestFilter {

    private static final Logger LOGGER = Logger.getLogger(BasicAuthFilter.class.getName());

    @Inject
    private UserStore userStore;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
      String authentication = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
      if (authentication == null) {
        throw new AuthenticationException("Authentication credentials are required");
      }

      if (!authentication.startsWith("Basic ")) {
        return;
      }

      authentication = authentication.substring("Basic ".length());
      String[] values =
          new String(DatatypeConverter.parseBase64Binary(authentication), Charset.forName("ASCII"))
              .split(":");
      if (values.length < 2) {
        throw new WebApplicationException(400);
      }

      String username = values[0];
      String password = values[1];

      LOGGER.log(Level.INFO, "{0} - {1}", new Object[] {username, password});

      User user = userStore.getUser(username);
      if (user == null) {
        throw new AuthenticationException("Authentication credentials are required");
      }

      if (!user.password.equals(password)) {
        throw new AuthenticationException("Authentication credentials are required");
      }

      requestContext.setSecurityContext(new MySecurityContext(user));
    }
  }

  static class MySecurityContext implements SecurityContext {

    private final User user;

    public MySecurityContext(User user) {
      this.user = user;
    }

    @Override
    public Principal getUserPrincipal() {
      return new Principal() {
        @Override
        public String getName() {
          return user.username;
        }
      };
    }

    @Override
    public boolean isUserInRole(String role) {
      return role.equals(user.role);
    }

    @Override
    public boolean isSecure() {
      return true;
    }

    @Override
    public String getAuthenticationScheme() {
      return "Basic";
    }

  }

  static class AuthenticationException extends WebApplicationException {

    public AuthenticationException(String message) {
      super(Response.status(Status.UNAUTHORIZED)
          .header("WWW-Authenticate", "Basic realm=\"" + "Dummy Realm" + "\"").type("text/plain")
          .entity(message).build());
    }
  }

  class User {

    public final String username;
    public final String role;
    public final String password;

    public User(String username, String password, String role) {
      this.username = username;
      this.password = password;
      this.role = role;
    }
  }

  class UserStore {

    public final Map<String, User> users = new ConcurrentHashMap<>();

    public UserStore() {
      users.put("peeskillet", new User("peeskillet", "secret", "USER"));
      users.put("stackoverflow", new User("stackoverflow", "superSecret", "ADMIN"));
    }

    public User getUser(String username) {
      return users.get(username);
    }
  }

  private static final String USER_RESPONSE = "Secured User Stuff";
  private static final String ADMIN_RESPONSE = "Secured Admin Stuff";
  private static final String USER_ADMIN_STUFF = "Secured User Admin Stuff";

  @Path("secured")
  public static class SecuredResource {

    @GET
    @Path("userSecured")
    @RolesAllowed("USER")
    public String getUser() {
      return USER_RESPONSE;
    }

    @GET
    @Path("adminSecured")
    @RolesAllowed("ADMIN")
    public String getAdmin() {
      return ADMIN_RESPONSE;
    }

    @GET
    @Path("userAdminSecured")
    @RolesAllowed({"USER", "ADMIN"})
    public String getUserAdmin() {
      return USER_ADMIN_STUFF;
    }
  }

  @Override
  public ResourceConfig configure() {
    return new ResourceConfig(SecuredResource.class).register(BasicAuthFilter.class)
        .register(RolesAllowedDynamicFeature.class).register(new AbstractBinder() {
          @Override
          protected void configure() {
            bind(new UserStore()).to(UserStore.class);
          }
        });
  }

  static String getBasicAuthHeader(String username, String password) {
    return "Basic " + Base64.encodeAsString(username + ":" + password);
  }

  @Test
  public void should_return_403_with_unauthorized_user() {
    Response response = target("secured/userSecured").request()
        .header(HttpHeaders.AUTHORIZATION, getBasicAuthHeader("stackoverflow", "superSecret"))
        .get();
    assertEquals(403, response.getStatus());
  }

  @Test
  public void should_return_200_response_with_authorized_user() {
    Response response = target("secured/userSecured").request()
        .header(HttpHeaders.AUTHORIZATION, getBasicAuthHeader("peeskillet", "secret")).get();
    assertEquals(200, response.getStatus());
    assertEquals(USER_RESPONSE, response.readEntity(String.class));
  }

  @Test
  public void should_return_403_with_unauthorized_admin() {
    Response response = target("secured/adminSecured").request()
        .header(HttpHeaders.AUTHORIZATION, getBasicAuthHeader("peeskillet", "secret")).get();
    assertEquals(403, response.getStatus());
  }

  @Test
  public void should_return_200_response_with_authorized_admin() {
    Response response = target("secured/adminSecured").request()
        .header(HttpHeaders.AUTHORIZATION, getBasicAuthHeader("stackoverflow", "superSecret"))
        .get();
    assertEquals(200, response.getStatus());
    assertEquals(ADMIN_RESPONSE, response.readEntity(String.class));
  }
}
