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
public class DzChSpellerTest {

    public DzChSpellerTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void testWordSpelling() throws Exception {
        String word = "pochôdzka";
        DzChSpeller instance = new DzChSpeller(new XMLAlphabet("sk"));

        assertEquals(1, instance.wordSpelling(word).size());
    }

}