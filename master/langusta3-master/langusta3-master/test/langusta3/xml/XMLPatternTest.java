package langusta3.xml;

import java.io.FileInputStream;
import langusta3.core.SpelledWord;
import langusta3.pattern.Pattern;
import langusta3.sk.DeTeNeRe;
import langusta3.sk.SlovakXMLGenerator;
import langusta3.spelling.NaiveSpeller;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author marx
 */
public class XMLPatternTest {
    
    private static String skAdjPattern =  "data/sk/patterns-adjective.xml";
    private static String skTestPattern = "data/sk/patterns-test.xml";
    private static String skVerbPattern = "data/sk/patterns-verb.xml";
    private static String skNewPattern =  "data/sk/new-my.xml";

    @Test
    public void testBasesChop() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("krásny").get(0);

        Pattern p = xg.getPossiblePatterns(w).get(0);
        assertNotNull(p);

        assertEquals(5, p.getBases(w).get("1").size());
    }

    @Test
    public void testBasesForms() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("krásny").get(0);

        Pattern p = xg.getPossiblePatterns(w).get(0);
        assertNotNull(p);

        assertEquals(5, p.getBases(w).get("1").size());
        assertEquals(5, p.getBases(w).get("1").size());
    }

    @Test
    public void testGetWordForms() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("krásny").get(0);
        Pattern p = xg.getPossiblePatterns(w).get(0);

        assertEquals("krásny", p.getBases(w).get("lemma").toString());
        assertEquals("krásnom", p.getWordForms(p.getBases(w)).get(4).getWord().toString());
    }

    @Test
    public void testGetWordFormsFilter() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("krásny").get(0);
        Pattern p = xg.getPossiblePatterns(w).get(0);

        assertEquals("krásneho", p.getWordForms(p.getBases(w)).get(1).getWord().toString());
    }

    @Test
    public void testAppend() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skTestPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("pekný").get(0);
        Pattern p = xg.getPossiblePatterns(w).get(0);

        assertNotNull(p.getBases(w));
        assertEquals("pekxého", p.getWordForms(p.getBases(w)).get(1).getWord().toString());
    }

    @Test
    public void testBaseInCondition() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skTestPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("domací").get(0);
        Pattern p = xg.getPossiblePatterns(w).get(0);

        assertEquals("domacieho", p.getWordForms(p.getBases(w)).get(1).getWord().toString());
    }

    @Test
    public void testNegativeCondition() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skTestPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("pekný").get(0);
        assertEquals(2, xg.getPossiblePatterns(w).size());
    }

    @Test
    public void testGlobalFilter() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skTestPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("medveď").get(0);
        Pattern p = xg.getPossiblePatterns(w).get(0);

        assertEquals("medvede", p.getWordForms(p.getBases(w)).get(2).getWord().toString());
        assertEquals("medvedie", p.getWordForms(p.getBases(w)).get(3).getWord().toString());
    }

    @Test
    public void testVerbFile() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skVerbPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("vidieť").get(1);
        Pattern p = xg.getPossiblePatterns(w).get(1);

        assertEquals("viď", p.getWordForms(p.getBases(w)).get(7).getWord().toString());
    }

    @Test
    public void testRevertDeTeNeLe() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skTestPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("medvede").get(0);
        SpelledWord e1 = ns.wordSpelling("medvede").get(0);
        SpelledWord e2 = ns.wordSpelling("medveďe").get(0);

        DeTeNeRe d = new DeTeNeRe("detenele");

        assertEquals(e1, d.revert(w, null).get(0));
        assertEquals(e2, d.revert(w, null).get(1));
    }

    @Test
    public void testRevertEqual() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skTestPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("medvede").get(0);
        // pattern: medveď
        assertEquals(1, xg.getPatterns().get(3).wordToLemma(w, ".*c3.*").size());
        assertEquals("medveď", xg.getPatterns().get(3).wordToLemma(w, ".*c3.*").get(0).toString());
    }

    @Test
    public void testRevertChop() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skTestPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("pracuj").get(0);
        // pattern: pracovať
        assertEquals( 1 ,xg.getPatterns().get(4).wordToLemma(w, ".*imp.*").size());
        assertEquals("pracovať",xg.getPatterns().get(4).wordToLemma(w, ".*imp.*").get(0).toString());
    }

    @Test
    public void testRevertKratenie() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skTestPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("silného").get(0);
        assertEquals("silný", xg.getPatterns().get(2).wordToLemma(w, ".*c2.*").get(0).toString());

        w = ns.wordSpelling("krásneho").get(0);

        // there is no rule for long syllable + y
        assertEquals(0, xg.getPatterns().get(2).wordToLemma(w, ".*c2.*").size());
    }

    @Test
    public void testRevertKrasny() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skTestPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("krásneho").get(0);

        assertEquals(1, xg.getPatterns().get(5).wordToLemma(w, ".*c2.*").size());
        assertEquals("krásny", xg.getPatterns().get(5).wordToLemma(w, ".*c2.*").get(0).toString());
    }

    @Test
    public void testFilterZucastneny() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("zúčastnených").get(1);

        for (SpelledWord l : xg.getPatterns().get(0).wordToLemma(w, ".*c2.*")) {
            if (l.toString().equals("zúčastňený")) {
                fail("De Te Ne Le filter does not work as expected");
            }
        }
    }

    @Test
    public void testFilterBytov() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skAdjPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("bytových").get(1);

        int match = 0;
        for (Pattern p : xg.getPatterns()) {
            if (p.wordToLemma(w, ".*c2.*").size() > 0) {
                match++;
            }
        }

        // acceptable patterns: pekný (bytový) + otcov (bytov)
        assertEquals(2, match);
    }

    @Test
    public void testBaseChangeInConditionListRevert() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skNewPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("indivíduá").get(0);

        assertEquals("indivíduum", xg.getPatterns().get(8).wordToLemma(w, ".*c4.*").get(0).toString());
    }

    @Test
    public void testBaseChangeInConditionListRevertVideo() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skNewPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("videá").get(0);

        assertEquals("video", xg.getPatterns().get(8).wordToLemma(w, ".*c4.*").get(1).toString());
    }

    @Test
    public void testVerbGeneration() throws Exception {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, SlovakXMLGenerator.class.getClassLoader().getResourceAsStream(skVerbPattern));
        xg.load();

        SpelledWord w = ns.wordSpelling("brať").get(0);
        Pattern p = xg.getPattern("brať");

        assertEquals("berie", p.getWordForms(p.getBases(w)).get(3).getWord().toString());
    }
}
