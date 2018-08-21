package langusta3.sk;

import java.io.InputStream;
import langusta3.spelling.iSpeller;
import langusta3.xml.XMLException;
import langusta3.xml.XMLGenerator;

/**
 *
 * @author marx
 */
public class SlovakXMLGenerator extends XMLGenerator {
    public SlovakXMLGenerator(iSpeller speller, InputStream is) throws XMLException {
        super(speller, is);

        conditions.add(new Syllable("syllable"));
        rules.add(new Soften("zmäkči"));
        filters.add(new Kratenie("krátenie"));
        globalFilters.add(new DeTeNeRe("detenele"));
    }
}
