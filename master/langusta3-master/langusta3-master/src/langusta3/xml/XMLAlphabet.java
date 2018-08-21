package langusta3.xml;

import java.util.List;
import langusta3.core.Alphabet;
import langusta3.core.GrammarClass;
import langusta3.core.Vowel;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

/** Extend Alphabet to load data from XML source
 *
 *  Alphabet is loaded as Resource so it have to be available
 *  when buildind application and cannot be added later.
 *
 * @todo unknown language?
 *
 * @author marx
 */
public class XMLAlphabet extends Alphabet {
    public XMLAlphabet(String language) throws XMLException {
        super();

        this.loadXML(language);
    }

    protected void loadXML(String language) throws XMLException {
        Element rootElement;
        
        try {
            SAXBuilder builder = new SAXBuilder(false);
            Document doc = builder.build(this.getClass().getResourceAsStream("/data/" + language + "/vowels.xml"));
            rootElement = doc.getRootElement();
        } catch (Exception e) {
            System.err.println(e);
            throw new XMLException("Unable to load resource with alphabet: " + "/data/" + language + "/vowels.xml");
        }
        
        List<Element> xmlVowelList = rootElement.getChild("vowel-list").getChildren("vowel");

        for (Element e : xmlVowelList) {
            Vowel v = new Vowel(null, e.getAttribute("id").getValue());
            List<Element> catList = e.getChildren("belongs-to");
            for (Element ec : catList) {
                GrammarClass vc = new GrammarClass(ec.getAttribute("class").getValue());
                v.addGrammarClass(vc);
            }

            this.addVowel(v);
        }
    }
}
