package org.eroese.vowels;

import org.junit.Assert;
import org.junit.Test;
import org.junit.Before;
import org.junit.After;

/**
 * @author eirnym
 */
public class MainTest {
    /**
     * Method: getArgument(final String[] args, int index, String defaultValue)
     */
    @Test
    public void testGetArgument() throws Exception {
        final String defaultValue = "defaultValue";
        final String first = "a";
        final String second = "b";

        String[] args = new String[] {first, second};
        Assert.assertEquals(first, Main.getArgument(args, 0, defaultValue));
        Assert.assertEquals(second, Main.getArgument(args, 1, defaultValue));
        Assert.assertEquals(defaultValue, Main.getArgument(args, 2, defaultValue));
        Assert.assertEquals(defaultValue, Main.getArgument(args, 200, defaultValue));
    }


} 
