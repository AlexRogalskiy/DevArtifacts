package langusta3.core;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author marx
 */
public class VowelTest {

    public VowelTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void testSetAlphabet() {
        Alphabet a = new Alphabet();
        Vowel v = new Vowel(a, "ch");

        assertEquals(a, v.getAlphabet());
    }

    @Test
    public void testIsInAlphabet() {
        Alphabet a = new Alphabet();
        Vowel v = new Vowel(null, "ch");
        a.addVowel(v);

        assertEquals(true, v.isInAlphabet());
    }

    @Test
    public void testIsInGrammarClass() {
        Vowel v = new Vowel (null, "ch");
        GrammarClass g = new GrammarClass("test");
        v.addGrammarClass(g);

        assertEquals(true, v.isInGrammarClass("test"));
    }
}