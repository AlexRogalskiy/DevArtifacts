package langusta3.xml;

import java.io.FileInputStream;
import langusta3.core.SpelledWord;
import langusta3.sk.SlovakXMLGenerator;
import langusta3.spelling.NaiveSpeller;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author marx
 */
public class XMLGeneratorTest {
    private static String skAdjPattern = "data/sk/patterns-adjective.xml";

    public XMLGeneratorTest() {
        
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void testInstance() throws Exception {
        XMLGenerator xg = new XMLGenerator(new NaiveSpeller(new XMLAlphabet("sk")), SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));

        xg.load();
        assertEquals(5, xg.getPatterns().size());
    }

    @Test
    public void testConditionsBasic() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("otcov").get(0);

        assertEquals(1, xg.getPossiblePatterns(w).size());
        assertEquals("otcov", xg.getPossiblePatterns(w).get(0).getID());
    }

    @Test
    public void testConditionsSyllableLong() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("pekný").get(0);

        assertEquals(1, xg.getPossiblePatterns(w).size());
        assertEquals("pekný", xg.getPossiblePatterns(w).get(0).getID());
    }

    @Test
    public void testConditionsSyllableShort() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("krásny").get(0);

        assertEquals(1, xg.getPossiblePatterns(w).size());
        assertEquals("pekný", xg.getPossiblePatterns(w).get(0).getID());
    }

    @Test
    public void testConditionsNone() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));

        xg.load();

        SpelledWord w = ns.wordSpelling("krásný").get(0);

        assertEquals(0, xg.getPossiblePatterns(w).size());
    }
}
