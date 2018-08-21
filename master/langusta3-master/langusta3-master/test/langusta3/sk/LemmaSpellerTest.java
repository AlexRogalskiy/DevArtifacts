package langusta3.sk;

import langusta3.xml.XMLAlphabet;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author marx
 */
public class LemmaSpellerTest {

    public LemmaSpellerTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void testWordSpelling() throws Exception {
        DzChSpeller instance = new LemmaSpeller(new XMLAlphabet("sk"));

        assertEquals(2, instance.wordSpelling("bolívia").size());
        assertEquals(1, instance.wordSpelling("priamy").size());
        assertEquals(1, instance.wordSpelling("abstinujúci").size());
    }

}