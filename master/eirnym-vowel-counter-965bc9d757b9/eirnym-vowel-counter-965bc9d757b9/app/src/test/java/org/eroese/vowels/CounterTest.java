package org.eroese.vowels;

import org.junit.Assert;
import org.junit.Test;
import org.junit.Before;
import org.junit.After;

import java.util.*;

public class CounterTest {
     /**
     * Tests {@link Counter#getAverage()}
     */
    @Test
    public void testGetAverage() throws Exception {
        Counter counter = new Counter();
        Vowels vowels1 = new Vowels(2, Arrays.asList('a', 'b'));
        Vowels vowels2 = new Vowels(2, Arrays.asList('c', 'd'));
        Map<Vowels, Double> result = new HashMap<>();
        result.put(vowels1, 1.0);
        result.put(vowels2, 2.5);

        counter.add(vowels1, 1);
        counter.add(vowels1, 1);
        counter.add(vowels2, 2);
        counter.add(vowels2, 3);

        Assert.assertEquals(result, counter.getAverage());
    }

    /**
     * Tests {@link Counter#average(Iterable)}
     */
    @Test
    public void testAverage() throws Exception {
        Assert.assertEquals(1, Counter.average(Collections.singleton(1)), 0.001);
        Assert.assertEquals(2, Counter.average(Arrays.asList(1, 2, 3)), 0.001);
        Assert.assertEquals(2.5, Counter.average(Arrays.asList(2, 3)), 0.001);
    }


}
