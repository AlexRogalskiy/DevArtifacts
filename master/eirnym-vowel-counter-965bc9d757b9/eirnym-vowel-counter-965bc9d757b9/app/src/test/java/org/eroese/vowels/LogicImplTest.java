package org.eroese.vowels;

import org.junit.Assert;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * LogicImpl Tester.
 *
 * @author <Authors name>
 * @version 1.0
 * @since <pre>Apr 24, 2016</pre>
 */
public class LogicImplTest {
    /**
     * Tests {@link LogicImpl#readCounts(String)}
     */
    @Test
    public void testReadCounts() throws Exception {
        Vowels vowels1 = new Vowels(6, Arrays.asList('a', 'o'));
        Vowels vowels2 = new Vowels(5, Arrays.asList('a', 'o'));
        Vowels vowels3 = new Vowels(4, Arrays.asList('a', 'e'));
        final String expectedFilename = "Hello world";
        final AtomicBoolean filenameChecked = new AtomicBoolean();
        final String string = "Platon made bamboo boats";

        Logic logic = new LogicImpl(){
            @Override
            public BufferedReader getInputReader(String filename) throws IOException {
                Assert.assertEquals(expectedFilename, filename);
                filenameChecked.set(true);
                return new BufferedReader(new StringReader(string));
            }
        };

        Map<Vowels, Double> result = new HashMap<>();
        result.put(vowels1, 2.5);
        result.put(vowels2, 2.0);
        result.put(vowels3, 2.0);


        Map<Vowels, Double> counts = logic.readCounts(expectedFilename);
        Assert.assertTrue(filenameChecked.get());

        Assert.assertEquals(result, counts);
    }

    /**
     * Tests {@link LogicImpl#count(String)}
     */
    @Test
    public void testCount() throws Exception {
        Vowels vowels = new Vowels(6, Arrays.asList('a', 'o'));

        Logic logic = new LogicImpl();
        Map<VowelCount, VowelCount> test = new HashMap<>();

        test.put(new VowelCount(vowels, 2), logic.count("Platon"));
        test.put(new VowelCount(vowels, 3), logic.count("bamboo"));
        test.put(new VowelCount(vowels, 3), logic.count("bambOo"));
        for (Map.Entry<VowelCount, VowelCount> entry : test.entrySet()) {
            Assert.assertEquals(entry.getKey(), entry.getValue());
        }
    }
}
