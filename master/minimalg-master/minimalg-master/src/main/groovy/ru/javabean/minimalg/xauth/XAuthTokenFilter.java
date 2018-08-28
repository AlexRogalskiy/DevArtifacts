package ru.javabean.minimalg.xauth;

import com.google.common.base.Optional;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Sifts through all incoming requests and installs a Spring Security principal
 * if a header corresponding to a valid user is found.
 *
 * @author Philip W. Sorst (philip@sorst.net)
 * @author Josh Long (josh@joshlong.com)
 * @author Michael Koltsov {@see <a href="https://github.com/mkoltsov">Github</a>}
 */
public class XAuthTokenFilter extends GenericFilterBean {

    private final UserDetailsService detailsService;
    private String headerName = "Authorization";

    public XAuthTokenFilter(UserDetailsService userDetailsService) {
        this.detailsService = userDetailsService;
    }

    @Override
    public void doFilter(ServletRequest arg0, ServletResponse arg1, FilterChain filterChain) throws IOException, ServletException {
        try {
            HttpServletRequest httpServletRequest = (HttpServletRequest) arg0;
            String authToken = httpServletRequest.getHeader(this.headerName);

            if (StringUtils.hasText(authToken)) {
                Optional<UserDetails> details = Optional.fromNullable(this.detailsService.loadUserByUsername(AuthUtils.getSubject(authToken)));

                //validate token
                if (details.isPresent() && details.get().isEnabled()) {
                    UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(details,
                            details.get().getPassword(),
                            details.get().getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(token);
                }
            }
            filterChain.doFilter(arg0, arg1);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

}