package langusta3.cz;

import langusta3.pattern.Pattern;
import langusta3.core.SpelledWord;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import langusta3.xml.XMLGenerator;
import langusta3.xml.XMLAlphabet;
import langusta3.xml.XMLException;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author marx
 */
public class CzechXMLGeneratorTest {

    public CzechXMLGeneratorTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void testHmyz() throws XMLException, FileNotFoundException {
        ChSpeller speller = new ChSpeller(new XMLAlphabet("cz"));
        XMLGenerator xg = new CzechXMLGenerator(speller, CzechXMLGenerator.class.getClassLoader().getResourceAsStream("data/cz/patterns-test.xml"));
        xg.load();

        SpelledWord w = speller.wordSpelling("hmyz").get(0);

        assertEquals(1, xg.getPossiblePatterns(w).size());
        assertEquals("hmyz", xg.getPossiblePatterns(w).get(0).getID());
    }

    @Test
    public void testMed() throws XMLException, FileNotFoundException {
        ChSpeller speller = new ChSpeller(new XMLAlphabet("cz"));
        XMLGenerator xg;
        xg = new CzechXMLGenerator(speller, CzechXMLGenerator.class.getClassLoader().getResourceAsStream("data/cz/patterns-test.xml"));
        xg.load();

        SpelledWord w = speller.wordSpelling("měď").get(0);

        assertEquals(1, xg.getPossiblePatterns(w).size());
        assertEquals("měď", xg.getPossiblePatterns(w).get(0).getID());

        Pattern p = xg.getPossiblePatterns(w).get(0);

        // @note: test na prepis měďi -> mědi
        assertEquals("mědi", p.getWordForms(p.getBases(w)).get(2).getWord().toString());
    }
}