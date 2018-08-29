//package com.example.captchaserver;
//
//import org.junit.Before;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.mock.web.MockHttpServletResponse;
//import org.springframework.test.context.junit4.SpringRunner;
//import org.springframework.ui.ModelMap;
//import org.springframework.web.servlet.ModelAndView;
//
//import java.io.IOException;
//import java.lang.reflect.Field;
//import java.lang.reflect.InvocationTargetException;
//import java.lang.reflect.Method;
//import java.time.LocalDateTime;
//import java.util.HashMap;
//import java.util.Map;
//
//import static org.junit.Assert.assertEquals;
//import static org.mockito.Matchers.any;
//import static org.mockito.Mockito.when;
//
//
//@RunWith(SpringRunner.class)
//@SpringBootTest
//public class CaptchaProcessorTests {
//    private CaptchaRequestsHandler processor;
//    private Field  proccessorUserIdData;
//    private Method getDateDiffInMinutes;
//
//
//    private HashMap<String, ResponseStructure> getUserIdData() {
//        try {
//            return (HashMap<String, ResponseStructure>) proccessorUserIdData.get(processor);
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
//
//    @Before
//    public void setUp() {
//        processor = new CaptchaRequestsHandler();
//        try {
//            proccessorUserIdData = CaptchaRequestsHandler.class.getDeclaredField("userId2Data");
//            proccessorUserIdData.setAccessible(true);
//
//            getDateDiffInMinutes = CaptchaRequestsHandler.class.getDeclaredMethod("getDateDiffInMinutes", LocalDateTime.class);
//            getDateDiffInMinutes.setAccessible(true);
//        } catch (NoSuchFieldException e) {
//            e.printStackTrace();
//        } catch (NoSuchMethodException e) {
//            e.printStackTrace();
//        }
//    }
//
//    @Test
//    public void testProcessPostRequestCorrectCaptcha() {
//        try {
//            processor.processGetRequest(new ModelMap(), new MockHttpServletResponse());
//            Map.Entry<String, ResponseStructure> entry = getUserIdData().entrySet().iterator().next();
//            ModelAndView modelAndView = processor.processPostRequest(new ModelMap(), new String[] {entry.getKey(), entry.getValue().captcha});
//            assertEquals("", modelAndView.getModel().get("errorReason"));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
//
//    @Test
//    public void testProcessPostRequestIncorrectCaptcha() {
//        try {
//            processor.processGetRequest(new ModelMap(), new MockHttpServletResponse());
//            Map.Entry<String, ResponseStructure> entry = getUserIdData().entrySet().iterator().next();
//            ModelAndView modelAndView = processor.processPostRequest(new ModelMap(), new String[] {entry.getKey(), entry.getValue().captcha.substring(1)});
//            assertEquals("CAPTCHA is not correct!", modelAndView.getModel().get("errorReason"));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
//
//    @Test
//    public void testProcessPostRequestIncorrectID() {
//        try {
//            processor.processGetRequest(new ModelMap(), new MockHttpServletResponse());
//            Map.Entry<String, ResponseStructure> entry = getUserIdData().entrySet().iterator().next();
//            ModelAndView modelAndView = processor.processPostRequest(new ModelMap(), new String[] {"-123", entry.getValue().captcha});
//            assertEquals("There is no such ID!", modelAndView.getModel().get("errorReason"));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
//
//    @Test
//    public void testProcessPostRequestTimeExceeded() {
//        try {
//            processor.processGetRequest(new ModelMap(), new MockHttpServletResponse());
//            Map.Entry<String, ResponseStructure> entry = getUserIdData().entrySet().iterator().next();
//            String[] params = new String[] {entry.getKey(), entry.getValue().captcha};
//
//            when(getDateDiffInMinutes.invoke(processor, any(LocalDateTime.class))).thenReturn(1);
//
//            ModelAndView modelAndView = processor.processPostRequest(new ModelMap(), params);
//            assertEquals("Time for answer is exceeded!", modelAndView.getModel().get("errorReason"));
//        } catch (IOException e) {
//            e.printStackTrace();
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        } catch (InvocationTargetException e) {
//            e.printStackTrace();
//        }
//    }
//}
