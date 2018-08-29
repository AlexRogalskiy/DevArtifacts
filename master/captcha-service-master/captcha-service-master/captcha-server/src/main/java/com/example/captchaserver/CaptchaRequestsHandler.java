package com.example.captchaserver;

import org.json.JSONObject;
import java.util.HashMap;
import java.util.UUID;


public class CaptchaRequestsHandler {
    private long answerDelayInSeconds;

    private String successAttribute   = "success";
    private String errorCodeAttribute = "errorCode";
    private String responseAttribute  = "response";

    private HashMap<String, Captcha> user2Captcha;
    private CaptchaFactory captchaFactory;

    private HashMap<String, JSONObject> responseQueue;

    public CaptchaRequestsHandler(int answerDelay) {
        user2Captcha   = new HashMap<>();
        captchaFactory = new CaptchaFactory();
        responseQueue  = new HashMap<>();

        answerDelayInSeconds = answerDelay;
    }

    public Captcha generate(String publicUserKey) throws RequestException {
        keyValidation(publicUserKey, true);
        Captcha captcha = (Captcha) captchaFactory.createObject();
        user2Captcha.put(publicUserKey, captcha);
        return captcha;
    }

    public Image image(String publicUserKey, String captchaUUID) throws RequestException {
        keyValidation(publicUserKey, true);
        Captcha captcha = getCaptcha(publicUserKey, captchaUUID);
        return captcha.getImage();
    }

    public JSONObject solve(String publicUserKey, String captchaUUID, String answer) throws RequestException {
        keyValidation(publicUserKey, true);
        Captcha captcha = getCaptcha(publicUserKey, captchaUUID);
        JSONObject json = new JSONObject();

        String uuid = UUID.randomUUID().toString();

        if (captcha.getLiveTime().getSeconds() >= answerDelayInSeconds) {
            json.put(successAttribute,   "false");
            json.put(errorCodeAttribute, "Time limit for an answer is exceeded");
        } else if (captcha.getCaptchaAnswer().equals(answer)) {
            json.put(successAttribute,   "true");
            json.put(errorCodeAttribute, "null");
        } else {
            json.put(successAttribute,   "false");
            json.put(errorCodeAttribute, "Incorrect captcha");
        }
        removeCaptcha(publicUserKey);
        responseQueue.put(uuid, json);
        return new JSONObject().put(responseAttribute, uuid);
    }

    public JSONObject verify(String privateUserKey, String answerToken) throws RequestException {
        keyValidation(privateUserKey, false);
        if (!responseQueue.containsKey(answerToken))
            return new JSONObject().put(errorCodeAttribute, "Invalid response token");
        return responseQueue.remove(answerToken);
    }

    private void keyValidation(String userKey, Boolean isPublicKey) throws RequestException {
        if (!Utils.isUUIDCorrect(userKey))
            throw new RequestException("Incorrect UUID value");
        Boolean isPresent = RequestHandlers.clientReqHandler.isClientPresent(userKey, isPublicKey);
        if (!isPresent)
            throw new RequestException("There is no user with the such UUID");
    }

    private Captcha getCaptcha(String publicUserKey, String captchaUUID) throws RequestException {
        Captcha captcha = user2Captcha.get(publicUserKey);
        if (captcha == null || !captcha.getId().equals(captchaUUID))
            throw new RequestException("Problems with the specified captcha uuid");
        return captcha;
    }

    private Captcha removeCaptcha(String publicUserKey) {
        return user2Captcha.remove(publicUserKey);
    }
}
