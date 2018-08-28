package ru.javabean.minimalg.xauth;

import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ru.javabean.minimalg.model.Model;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * This controller generates the token that must be present in subsequent REST
 * invocations.
 *
 * @author Philip W. Sorst (philip@sorst.net)
 * @author Josh Long (josh@joshlong.com)
 * @author Michael Koltsov {@see <a href="https://github.com/mkoltsov">Github</a>}
 */
@RestController
@RequestMapping("/auth")
public class UserXAuthTokenController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Autowired
    public UserXAuthTokenController(AuthenticationManager am, UserDetailsService userDetailsService) {
        this.authenticationManager = am;
        this.userDetailsService = userDetailsService;
    }

    @RequestMapping(value = "/login", method = {RequestMethod.POST})
    public Map<String, String> authorize(@RequestBody Model credentials, HttpServletRequest httpServletRequest) throws JOSEException {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(credentials.getEmail(), credentials.getPassword());
        Authentication authentication = this.authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails details = this.userDetailsService.loadUserByUsername(credentials.getEmail());

        return AuthUtils.createToken(httpServletRequest.getRemoteHost(), details.getUsername());
    }

}
