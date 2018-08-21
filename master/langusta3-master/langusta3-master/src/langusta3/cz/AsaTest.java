package langusta3.cz;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import langusta3.core.SpelledWord;
import langusta3.pattern.FormInfoTO;
import langusta3.pattern.Pattern;
import langusta3.xml.XMLAlphabet;
import langusta3.xml.XMLException;
import langusta3.xml.XMLGenerator;

/**
 *
 * @author marx
 */
public class AsaTest {
    public static void main(String args[]) throws XMLException, FileNotFoundException, IOException {
        ChSpeller speller = new ChSpeller(new XMLAlphabet("cz"));
        XMLGenerator xg = new CzechXMLGenerator(speller, new FileInputStream(args[0]));
        xg.load();

//        for (SpelledWord w : speller.wordSpelling(args[1])) {
//            for (Pattern p : xg.getPossiblePatterns(w)) {
//                System.out.println("PATTERN " + p.getID());
//                System.out.println(p.getWordForms(p.getBases(w)));
//            }
//        }
//        
        BufferedReader br = new BufferedReader(new FileReader(args[1]));
        String line;
        
        while ( (line = br.readLine()) != null) {

            for (SpelledWord w : speller.wordSpelling(line)) {

                    for (Pattern p : xg.getPossiblePatterns(w)) {

                for (FormInfoTO x : p.getWordForms(p.getBases(w))) {
                    System.out.println(w + "#vzor:" + p.getID() + "#" + x.getWord() + "#" + x.getTag());
                }
//                System.out.print(w + ":" + p.getID());
//                for (FormInfoTO x : p.getWordForms(p.getBases(w))) {
//                    System.out.print(":" + x.getWord());
//                }
//                System.out.println();
            }
        }
        }
        return;
    }
}
