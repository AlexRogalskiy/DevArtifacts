package langusta3.spelling;

import java.util.List;
import langusta3.core.Alphabet;
import langusta3.core.GrammarClass;
import langusta3.core.Vowel;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author marx
 */
public class NaiveSpellerTest {
    private static Alphabet alphabet;

    public NaiveSpellerTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
        alphabet = new Alphabet();

        Vowel v1 = new Vowel(null, "p");
        v1.addGrammarClass(new GrammarClass("spoluhláska"));
        Vowel v2 = new Vowel(null, "e");
        Vowel v3 = new Vowel(null, "s");
        Vowel v4 = new Vowel(null, "pe");

        alphabet.addVowel(v1);
        alphabet.addVowel(v2);
        alphabet.addVowel(v3);
        alphabet.addVowel(v4);
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void testWordSpelling() {
        NaiveSpeller ns = new NaiveSpeller(alphabet);

        assertEquals(2, ns.wordSpelling("pes").size());
    }

    @Test
    public void testWordSpellingVowels() {
        NaiveSpeller ns = new NaiveSpeller(alphabet);

        assertEquals(true, ns.wordSpelling("pes").get(0).get(0).isInGrammarClass("spoluhláska"));
    }
}