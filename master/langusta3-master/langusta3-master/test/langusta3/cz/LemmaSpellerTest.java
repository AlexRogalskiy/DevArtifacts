package langusta3.cz;

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
        ChSpeller instance = new ChSpeller(new XMLAlphabet("cz"));

        assertEquals(1, instance.wordSpelling("hmyz").size());
        assertEquals(1, instance.wordSpelling("chléb").size());
    }
}
