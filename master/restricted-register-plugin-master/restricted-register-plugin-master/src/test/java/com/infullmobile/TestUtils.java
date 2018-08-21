package com.infullmobile;

import org.junit.Assert;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.math.BigInteger;
import java.util.Random;

/**
 * Created by Adam Kobus on 25.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class TestUtils {

    public static final int SHORT_STRING_LENGTH = 10;
    public static final int MEDIUM_STRING_LENGTH = 50;
    public static final int LONG_STRING_LENGTH = 1000;

    private static final int RND_STRING_RADIX = 16; // hex

    public final Random rnd = new Random();

    public String getRandomShortString() {
        return generateRandomString(SHORT_STRING_LENGTH);
    }

    public String getRandomMediumString() {
        return generateRandomString(MEDIUM_STRING_LENGTH);
    }

    public String getRandomLongString() {
        return generateRandomString(LONG_STRING_LENGTH);
    }

    public String generateRandomString(int charactersCount) {
        return new BigInteger(RND_STRING_RADIX * charactersCount, rnd).toString(RND_STRING_RADIX);
    }

    public static <T> void testIfUtilsClassIsWellDefined(final Class<T> type) throws Exception {
        // class must be final
        Assert.assertTrue(Modifier.isFinal(type.getModifiers()));

        // public fields should be static, final, uppercase
        final Field[] fields = type.getDeclaredFields();
        for (Field field : fields) {
            if (field.isAccessible()) {
                final String fieldNameUpperCase = field.getName().toUpperCase();
                Assert.assertEquals(fieldNameUpperCase, field.getName());
                Assert.assertTrue(Modifier.isFinal(field.getModifiers()));
                Assert.assertTrue(Modifier.isStatic(field.getModifiers()));
            }
        }
        // no public constructor should be available
        final Constructor<?>[] constructors = type.getConstructors();
        for (Constructor<?> constructor : constructors) {
            Assert.assertFalse(constructor.isAccessible());
        }

        // private constructor without exception inside it
        final Constructor<?> constructor = type.getDeclaredConstructor();
        Assert.assertFalse(constructor.isAccessible());
        Assert.assertTrue(Modifier.isPrivate(constructor.getModifiers()));

        constructor.setAccessible(true);
        constructor.newInstance();
        constructor.setAccessible(false);

        // all public methods are static
        final Method[] methods = type.getMethods();
        for (Method method : methods) {
            if (method.isAccessible()) {
                Assert.assertTrue(Modifier.isStatic(method.getModifiers()));
            }
        }
    }
}
