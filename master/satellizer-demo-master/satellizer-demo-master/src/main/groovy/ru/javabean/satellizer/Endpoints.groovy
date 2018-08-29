package ru.javabean.satellizer

import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

import javax.servlet.http.HttpServletResponse

/**
 * Created by misha_ring on 10/12/14.
 */
@RestController
class Endpoints {
    @RequestMapping(value = "/auth/login", method = RequestMethod.POST)
    def login(@RequestBody Map<String, String> body, HttpServletResponse response) {
        if (body.get("email") == 'chef') return AuthUtils.createToken(body.get("email"), Long.valueOf("1"))
        else response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Very Bad Exception has eaten my breakfast");
    }

    @RequestMapping(value = "/api/me", method = RequestMethod.PUT)
    def testPoint(@RequestHeader("Authorization") String auth, @RequestBody Map<String, String> body) {
        def b = 0
    }
}
