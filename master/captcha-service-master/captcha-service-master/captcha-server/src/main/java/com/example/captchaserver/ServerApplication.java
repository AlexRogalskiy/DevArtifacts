package com.example.captchaserver;

import org.json.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;


@SpringBootApplication
public class ServerApplication {
    private static String usage = "\n\n[-] Usage: java -jar -Dproduction=[true/false] server.jar <ttl>";

	public static void main(String[] args) {
        if (args.length != 1 || !CommandLineArguments.setTimeForAnswer(args[0]) || !CommandLineArguments.setProduction()) {
            System.out.println(usage);
            return;
        }
		SpringApplication.run(ServerApplication.class, args);
	}
}


@RestController
@RequestMapping("/captcha")
class CaptchaController {
    private String errorCodeAttribute = "errorCode";
    private String captchaAttribute   = "captcha";


    @RequestMapping(value="/new", method=RequestMethod.GET)
    public ResponseEntity<String> getNewCaptcha(@ModelAttribute("public") String userPublicKey) {
        try {
            return new ResponseEntity<>(RequestHandlers.captchaReqHandler.generate(userPublicKey).toJson().toString(), HttpStatus.OK);
        } catch (RequestException e) {
            return new ResponseEntity<>(new JSONObject().put(errorCodeAttribute, e.getMessage()).toString(), HttpStatus.BAD_REQUEST);
        }
    }


    @RequestMapping(value="/image", method=RequestMethod.GET)
    public ModelAndView getCaptchaImage(@ModelAttribute("public") String userPublicKey,
                                        @ModelAttribute("request") String captchaUUID,
                                        ModelMap model) {
        try {
            model.addAttribute(captchaAttribute, RequestHandlers.captchaReqHandler.image(userPublicKey, captchaUUID).toBase64());
        } catch (RequestException e) {
            model.addAttribute(captchaAttribute, "");
        }
        return new ModelAndView("index", model);
    }


    @RequestMapping(value="/solve", method=RequestMethod.POST)
    public ResponseEntity<String> postSolveCaptcha(@ModelAttribute("public") String userPublicKey,
                                                   @ModelAttribute("request") String captchaUUID,
                                                   @ModelAttribute("answer") String answer) {
        try {
            return new ResponseEntity<>(RequestHandlers.captchaReqHandler.solve(userPublicKey, captchaUUID, answer).toString(), HttpStatus.OK);
        } catch (RequestException e) {
            return new ResponseEntity<>(new JSONObject().put(errorCodeAttribute, e.getMessage()).toString(), HttpStatus.BAD_REQUEST);
        }
    }


    @RequestMapping(value="/verify", method=RequestMethod.GET)
    public ResponseEntity<String> getVerifyResult(@ModelAttribute("secret") String privateUserKey,
                                  @ModelAttribute("response") String answerToken) {
        try {
            return new ResponseEntity<String>(RequestHandlers.captchaReqHandler.verify(privateUserKey, answerToken).toString(), HttpStatus.OK);
        } catch (RequestException e) {
            return new ResponseEntity<>(new JSONObject().put(errorCodeAttribute, e.getMessage()).toString(), HttpStatus.BAD_REQUEST);
        }
    }
}


@RestController
@RequestMapping("/client")
class ClientController {

    @RequestMapping(value="/register", method=RequestMethod.GET)
    @ResponseBody
    public String postClientRegister(ModelMap model, HttpServletResponse response) {
        return RequestHandlers.clientReqHandler.register().toJson().toString();
    }
}
