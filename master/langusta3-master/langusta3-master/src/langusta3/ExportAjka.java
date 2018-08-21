package langusta3;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import langusta3.core.SpelledWord;
import langusta3.pattern.FormInfoTO;
import langusta3.pattern.Pattern;
import langusta3.sk.SlovakXMLGenerator;
import langusta3.spelling.NaiveSpeller;
import langusta3.xml.XMLAlphabet;
import langusta3.xml.XMLException;
import langusta3.xml.XMLGenerator;

/**
 *
 * @author marx
 */
public class ExportAjka {
    private static String skAdjectivePattern = "/home/marx/nlp/Langusta3/src/data/sk/patterns-adjective.xml";
    private static String skVerbPattern = "/home/marx/nlp/Langusta3/src/data/sk/patterns-verb.xml";


    public static void main(String[] args) throws XMLException, FileNotFoundException, IOException {
        NaiveSpeller ns = new NaiveSpeller(new XMLAlphabet("sk"));
        XMLGenerator xg = new SlovakXMLGenerator(ns, new FileInputStream(skVerbPattern));
        xg.load();

        BufferedReader input = new BufferedReader(new FileReader("/home/marx/@INBOX/seznam-data/k5/slovo.vzor"));

        String line;
        while (( line = input.readLine()) != null) {
            line = line.trim();

            String[] w = line.split(":");
//            w[1] = w[1].replace("[", "");
//            w[1] = w[1].replace("]", "");

            Pattern p = xg.getPattern(w[0]);

            if (p == null) {
                System.err.println("Pattern " + w[0] + " not found");
                continue;
            }

            for (SpelledWord s : ns.wordSpelling(w[1])) {
                Map<String,SpelledWord> base;

//                try {
                    base = p.getBases(s);
//                } catch (Exception e) {
//                    continue;
//                }
                
                if (base != null) {
                    List<FormInfoTO> l = p.getWordForms(p.getBases(s));

                    for (FormInfoTO f : l) {
                        System.out.println(f.getLemma().toString() + ":" + f.getWord() + ":" + f.getTag());
                    }
                }
            }
        }
    }
}
