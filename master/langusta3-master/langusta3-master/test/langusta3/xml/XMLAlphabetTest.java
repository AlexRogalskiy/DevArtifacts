package langusta3.xml;

import langusta3.core.Alphabet;
import langusta3.core.Vowel;
import langusta3.spelling.NaiveSpeller;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author marx
 */
public class XMLAlphabetTest {

    public XMLAlphabetTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void testLoadXML() throws Exception {
        Alphabet a = new XMLAlphabet("sk");
        Vowel v;

        v = new Vowel(a, "ch");
        assertEquals(true, v.isInAlphabet());

        v = new Vowel(a, "test");
        assertEquals(false, v.isInAlphabet());
    }

    @Test
    public void testSpelling() throws Exception {
        Alphabet a = new XMLAlphabet("sk");
        NaiveSpeller ns = new NaiveSpeller(a);

        assertEquals(1, ns.wordSpelling("pes").size());
        assertEquals(4, ns.wordSpelling("chlieb").size());
        
        
    }
}