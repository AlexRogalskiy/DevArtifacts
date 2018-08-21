package org.jenkins.plugins.jenkinsrest;


import junit.framework.TestCase;

import java.util.List;

/**
 * Created by kyleh on 4/22/14.
 */
public class TestUtils extends TestCase {


    public void testParseURLList() {
        String testInput = "test-host-001.local";
        List<String> check = Utils.parseURLList(testInput);

        assertEquals(check.size(), 1);
        assertEquals(check.get(0), "test-host-001.local");

        testInput = "test-host-001.local,       www.test-host-002.com";
        check = Utils.parseURLList(testInput);

        assertEquals(check.size(), 2);
        assertEquals(check.get(0), "test-host-001.local");
        assertEquals(check.get(1), "www.test-host-002.com");

        testInput = "['test-host-001.local','www.test-host-002.com']";
        check = Utils.parseURLList(testInput);

        assertEquals(check.size(), 2);
        assertEquals(check.get(0), "test-host-001.local");
        assertEquals(check.get(1), "www.test-host-002.com");

        testInput = "'test-host-001.local','www.test-host-002.com'";
        check = Utils.parseURLList(testInput);

        assertEquals(check.size(), 2);
        assertEquals(check.get(0), "test-host-001.local");
        assertEquals(check.get(1), "www.test-host-002.com");

        testInput = "";
        check = Utils.parseURLList(testInput);
        assertEquals(check.size(), 0);
    }

}
