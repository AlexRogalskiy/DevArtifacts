package langusta3.xml;

import java.io.InputStream;
import java.util.List;
import langusta3.pattern.Generator;
import langusta3.spelling.iSpeller;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

/** Generator which can load patterns from XML file
 *
 * @author marx
 */
public class XMLGenerator extends Generator {
    private InputStream input;

    public XMLGenerator(iSpeller speller, InputStream is) {
        super(speller);
        input = is;
    }

    public void load() throws XMLException {
        try {
            SAXBuilder builder = new SAXBuilder(false);
            Document doc = builder.build(input);
            Element rootElement = doc.getRootElement();

            for (Element e : (List<Element>) rootElement.getChildren("pattern")) {
                XMLPattern pattern = new XMLPattern(this, e);

                if (pattern.getID() != null) {
                    this.addPattern(pattern);
                }
            }
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            throw new XMLException("Unable to read patterns from the XML file");
        }
    }
}
