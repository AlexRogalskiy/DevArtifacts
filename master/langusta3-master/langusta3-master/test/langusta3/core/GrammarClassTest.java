package langusta3.core;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author marx
 */
public class GrammarClassTest {

    public GrammarClassTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void testEquals1() {
        GrammarClass instance1 = new GrammarClass("test");
        GrammarClass instance2 = new GrammarClass("test");
        GrammarClass instance3 = new GrammarClass("test test");

        assertEquals(true, instance1.equals(instance1));
        assertEquals(true, instance1.equals(instance2));
        assertEquals(false, instance1.equals(instance3));
    }
}