package langusta3;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import langusta3.core.SpelledWord;
import langusta3.pattern.Pattern;
import langusta3.sk.LemmaSpeller;
import langusta3.sk.SlovakXMLGenerator;
import langusta3.spelling.NaiveSpeller;
import langusta3.xml.XMLAlphabet;
import langusta3.xml.XMLException;
import langusta3.xml.XMLGenerator;

/**
 *
 * @author marx
 */
public class Main {

    private static String skAdjectivePattern = "/home/marx/nlp/Langusta3/src/data/sk/new.xml";

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws XMLException, FileNotFoundException, UnsupportedEncodingException, IOException {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        LemmaSpeller lemmaSpeller = new LemmaSpeller(new XMLAlphabet("sk"));

        XMLGenerator xg = new SlovakXMLGenerator(ns, new FileInputStream(skAdjectivePattern));
        xg.load();

        BufferedReader input = new BufferedReader(new FileReader("/home/marx/result.pre.uniq"));
        String tag = ".*c4.*";
        String line = null;

        while ((line = input.readLine()) != null) {
            line = line.trim();

            List<SpelledWord> ls = ns.wordSpelling(line);

            if (ls == null) {
                continue;
            }

            int crlf = 0;

            for (SpelledWord w : ls) {
                /** Berie do úvahy len lemma
                List<Pattern> lp = xg.getPossiblePatterns(w);
                
                if ((lp != null) && (lp.size() > 0)) {
                System.out.println(w + ":" + lp);
                }
                 **/
                /** Berie do úvahy predložku **/
                for (Pattern p : xg.getPatterns()) {
                    List<SpelledWord> candidateLemma = p.wordToLemma(w, tag);

                    if (candidateLemma.size() > 0) {
                        /** otestuj, ci je tento spelling medzi možnými
                         **
                         ** máme lepší speller na lemmy než na zbytok
                         **/
                        for (SpelledWord s : candidateLemma) {
                            List<SpelledWord> lemmaSpell = lemmaSpeller.wordSpelling(s.toString());

                            if (lemmaSpell.contains(s) == true) {
                                List<Pattern> patterns = xg.getPossiblePatterns(s);

                                if (patterns.contains(p)) {
                                    crlf++;
                                    System.out.println(w.toString() + ":" + tag + ":" + p.getID() + ":" + s.toString());
//                                    } else {
//                                    /** Reálne to moc nepomohlo - vyhodí 13 tvarov z celého k2-pre **/
//                                        System.out.println(s1.getStringAsList() + ":" + p.getID());
                                }
                            }
                        }
                    }
                }

            }
//            if (crlf == 1) {
//                // prave jeden vzor -> tj. na spravnom vstupe => spravny vysledok
//                System.out.println("UNIQ PATTERN");
//            }
            if (crlf > 0) {
                System.out.println();
            }

        }
    }
}
