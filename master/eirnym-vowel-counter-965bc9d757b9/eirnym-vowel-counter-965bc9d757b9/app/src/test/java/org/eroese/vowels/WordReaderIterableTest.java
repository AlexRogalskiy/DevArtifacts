package org.eroese.vowels;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.*;

/**
 * @author eirnym
 */
public class WordReaderIterableTest {
    private final Map<String, List<String>> cases = new HashMap<>();

    @Before
    public void before() {
        cases.put("Hello world", Arrays.asList("Hello", "world"));
        cases.put("Hello world 123", Arrays.asList("Hello", "world"));
        cases.put("Hello 123 world", Arrays.asList("Hello", "world"));
        cases.put("Hello \n" +
                "\n" +
                "world", Arrays.asList("Hello", "world"));
        cases.put("{Hello \n" +
                "\n" +
                "world123", Arrays.asList("Hello", "world"));
    }

    @After
    public void after() {
        cases.clear();
    }


    @Test
    public void testWordIterable() throws IOException {
        ;
        for (Map.Entry<String, List<String>> entry : cases.entrySet()) {
            try (BufferedReader reader = new BufferedReader(new StringReader(entry.getKey()))) {
                iteratorEquality(entry.getValue().iterator(), new WordReaderIterator(reader));
            }
        }
    }

    private void iteratorEquality(Iterator<String> expected, Iterator<String> actual) {
        while (actual.hasNext() && expected.hasNext()) {

            String expectedString = expected.next();
            String actualString = actual.next();

            Assert.assertEquals(expectedString, actualString);
        }
        Assert.assertFalse(actual.hasNext());
        Assert.assertFalse(expected.hasNext());
    }
}
