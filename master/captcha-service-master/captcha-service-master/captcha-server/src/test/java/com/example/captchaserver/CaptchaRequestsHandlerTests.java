package com.example.captchaserver;


import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CaptchaRequestsHandlerTests {
    private CaptchaRequestsHandler requestsHandler;
    private Method keyValidation;
    private Method getCaptcha;

    private Client  client;
    private Captcha captcha;

    private int timeDelayInSeconds = 60;

    @Rule
    public ExpectedException expectedEx = ExpectedException.none();

    @Before
    public void setUp() throws NoSuchMethodException, RequestException {
        requestsHandler = new CaptchaRequestsHandler(timeDelayInSeconds);

        client  = RequestHandlers.clientReqHandler.register();
        captcha = requestsHandler.generate(client.publicKey());

        keyValidation = ReflectionUtils.findMethod(CaptchaRequestsHandler.class, "keyValidation", String.class, Boolean.class);
        getCaptcha    = ReflectionUtils.findMethod(CaptchaRequestsHandler.class, "getCaptcha", String.class, String.class);

        ReflectionUtils.makeAccessible(keyValidation);
        ReflectionUtils.makeAccessible(getCaptcha);
    }

    @Test
    public void testKeyValidationIncorrectUUID() throws IllegalAccessException, RequestException {
        try {
            expectedEx.expect(RequestException.class);
            expectedEx.expectMessage("Incorrect UUID value");
            keyValidation.invoke(requestsHandler, "123", true);
        } catch (InvocationTargetException e) {
            throw (RequestException) e.getCause();
        }
    }

    @Test
    public void testPublicKeyValidationNoSuchUser() throws RequestException, InvocationTargetException, IllegalAccessException {
        try {
            expectedEx.expect(RequestException.class);
            expectedEx.expectMessage("There is no user with the such UUID");
            keyValidation.invoke(requestsHandler, UUID.randomUUID().toString(), true);
        } catch (InvocationTargetException e) {
            throw (RequestException) e.getCause();
        }
    }

    @Test
    public void testPrivateKeyValidationNoSuchUser() throws RequestException, InvocationTargetException, IllegalAccessException {
        try {
            expectedEx.expect(RequestException.class);
            expectedEx.expectMessage("There is no user with the such UUID");
            keyValidation.invoke(requestsHandler,UUID.randomUUID().toString(), false);
        } catch (InvocationTargetException e) {
            throw (RequestException) e.getCause();
        }
    }

    @Test
    public void testSuccessCaptchaGenerate() {
        Captcha captcha;
        try {
            captcha = requestsHandler.generate(client.publicKey());
        } catch (RequestException e) {
            captcha = null;
        }
        assertNotEquals(null, captcha);
    }

    @Test
    public void testFailedCaptchaGenerate() {
        Captcha captcha;
        try {
            captcha = requestsHandler.generate(UUID.randomUUID().toString());
        } catch (RequestException e) {
            captcha = null;
        }
        assertEquals(null, captcha);
    }

    @Test
    public void testGetCaptchaIncorrectCaptchaUUID() throws RequestException, IllegalAccessException {
        try {
            expectedEx.expect(RequestException.class);
            expectedEx.expectMessage("Problems with the specified captcha uuid");
            getCaptcha.invoke(requestsHandler,client.publicKey(), "");
        } catch (InvocationTargetException e) {
            throw (RequestException) e.getCause();
        }
    }

    @Test
    public void testGetCaptchaNoMatching() throws IllegalAccessException, RequestException {
        try {
            expectedEx.expect(RequestException.class);
            expectedEx.expectMessage("Problems with the specified captcha uuid");
            getCaptcha.invoke(requestsHandler,client.publicKey(), UUID.randomUUID().toString());
        } catch (InvocationTargetException e) {
            throw (RequestException) e.getCause();
        }
    }

    @Test
    public void testGetCaptchaSuccess() {
        try {
            captcha = (Captcha) getCaptcha.invoke(requestsHandler,client.publicKey(), captcha.getId());

        } catch (Exception e) {
            captcha = null;
        }
        assertNotEquals(null, captcha);
    }

    @Test
    public void testVerifySuccess() throws RequestException, JSONException {
        JSONObject response = requestsHandler.solve(client.publicKey(), captcha.getId(), captcha.getCaptchaAnswer());
        response = requestsHandler.verify(client.privateKey(), response.getString("response"));

        assertEquals("true", response.getString("success"));
    }

    @Test
    public void testVerifyIncorrect() throws RequestException, JSONException {
        JSONObject response = requestsHandler.solve(client.publicKey(), captcha.getId(), "");
        response = requestsHandler.verify(client.privateKey(), response.getString("response"));

        assertEquals("false", response.getString("success"));
    }

    @Test
    public void testVerifyTimeLimitExceeded() throws RequestException, JSONException, NoSuchMethodException, InvocationTargetException, IllegalAccessException, NoSuchFieldException {
        Field user2Captcha = ReflectionUtils.findField(CaptchaRequestsHandler.class, "user2Captcha");
        ReflectionUtils.makeAccessible(user2Captcha);

        Captcha captcha = Mockito.spy(requestsHandler.generate(client.publicKey()));
        ((HashMap<String, Captcha>) ReflectionUtils.getField(user2Captcha, requestsHandler)).put(client.publicKey(), captcha);
        when(captcha.getLiveTime()).thenReturn(Duration.between(Instant.now(), Instant.now()).plusSeconds(timeDelayInSeconds));

        JSONObject response = requestsHandler.solve(client.publicKey(), captcha.getId(), captcha.getCaptchaAnswer());
        response = requestsHandler.verify(client.privateKey(), response.getString("response"));

        assertEquals("false", response.getString("success"));
        assertEquals("Time limit for an answer is exceeded", response.get("errorCode"));
    }



}
