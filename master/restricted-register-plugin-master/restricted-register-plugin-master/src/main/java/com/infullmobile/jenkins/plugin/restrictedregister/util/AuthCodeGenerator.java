package com.infullmobile.jenkins.plugin.restrictedregister.util;

import java.math.BigInteger;
import java.security.SecureRandom;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class AuthCodeGenerator {

    private static final int AUTH_CODE_BITS_COUNT = 8 * 32;
    private static final int AUTH_CODE_RADIX = 32;

    private AuthCodeGenerator() {

    }

    public static String genUniqueAuthCode() {
        final SecureRandom random = new SecureRandom();
        final BigInteger bigInteger = new BigInteger(AUTH_CODE_BITS_COUNT, random);
        return bigInteger.toString(AUTH_CODE_RADIX);
    }
}
