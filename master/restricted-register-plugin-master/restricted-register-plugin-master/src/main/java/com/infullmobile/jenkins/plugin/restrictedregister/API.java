package com.infullmobile.jenkins.plugin.restrictedregister;

import net.sf.json.JSONObject;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Locale;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class API {

    static final String JSON_KEY_STATUS = "status";
    static final String JSON_KEY_ERROR_DATA_MESSAGE = "message";
    static final String JSON_KEY_DATA = "data";
    static final String JSON_STATUS_ERROR = "error";
    static final String JSON_STATUS_SUCCESS = "success";

    private static final String FORMAT_GENERAL_ERROR = "error (500): %s";
    private static final String GENERAL_ERROR_MESSAGE = String.format(Locale.US, FORMAT_GENERAL_ERROR, "server error");

    private API() {

    }

    public static JSONObject success() {
        return success(null);
    }

    @SuppressWarnings("WeakerAccess")
    public static JSONObject success(@Nullable JSONObject data) {
        final JSONObject ret = new JSONObject();
        ret.put(JSON_KEY_STATUS, JSON_STATUS_SUCCESS);
        if (data != null) {
            ret.put(JSON_KEY_DATA, data);
        } else {
            ret.put(JSON_KEY_DATA, new JSONObject());
        }
        return ret;
    }

    public static JSONObject errorWithException(@Nullable Exception exception) {
        if (exception != null && exception instanceof RegistrationException) {
            return errorWithData(((RegistrationException) exception).toJson());
        }
        final String errorMessage = getMessageForError(exception);
        return errorWithMessage(errorMessage);
    }

    public static JSONObject errorWithMessage(@Nonnull String errorMessage) {
        final JSONObject data = new JSONObject();
        data.put(JSON_KEY_ERROR_DATA_MESSAGE, errorMessage);
        return errorWithData(data);
    }

    private static JSONObject errorWithData(@Nullable JSONObject data) {
        if (data == null) {
            return errorWithException(null);
        }
        final JSONObject ret = new JSONObject();
        ret.put(JSON_KEY_DATA, data);
        ret.put(JSON_KEY_STATUS, JSON_STATUS_ERROR);
        return ret;
    }

    private static String getMessageForError(@Nullable Exception exception) {
        String ret;
        if (exception == null) {
            ret = GENERAL_ERROR_MESSAGE;
        } else {
            if (exception instanceof RegistrationException) {
                ret = exception.getMessage();
            } else {
                ret = String.format(Locale.US, FORMAT_GENERAL_ERROR, exception.getMessage());
            }
        }
        return ret;
    }
}
