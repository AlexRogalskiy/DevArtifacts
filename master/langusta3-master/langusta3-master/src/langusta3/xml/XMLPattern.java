package langusta3.xml;

import java.util.ArrayList;
import java.util.List;
import langusta3.pattern.FormInfo;
import langusta3.pattern.Generator;
import langusta3.pattern.Pattern;
import langusta3.pattern.condition.ConditionInfo;
import org.jdom.DataConversionException;
import org.jdom.Element;

/** Pattern that can be loaded from XML file
 *
 * @author marx
 */
class XMLPattern extends Pattern {
    public XMLPattern(Generator g, Element patternElement) throws DataConversionException {
        super(g);

        this.setID(patternElement.getAttribute("id").getValue());
        if ((patternElement.getAttribute("parent") != null) && (this.getID().endsWith("_Z"))) {
            this.setLimitPattern(patternElement.getAttribute("parent").getValue());
        }
        
        // load negative condition-lists and their conditions
        for (Element cl : (List<Element>) patternElement.getChildren("negative-condition-list")) {
            List<ConditionInfo> lci = new ArrayList<ConditionInfo>();

            for (Element c : (List<Element>) cl.getChildren("condition")) {
                ConditionInfo ci = new ConditionInfo(null, c.getAttributeValue("type"), c.getAttribute("charno").getIntValue(), c.getAttributeValue("value"));
                lci.add(ci);
            }

            this.negativeConditionLists.add(lci);
        }

        // load condition-lists and their conditions
        for (Element cl : (List<Element>) patternElement.getChildren("condition-list")) {
            List<ConditionInfo> lci = new ArrayList<ConditionInfo>();
            List<ConditionInfo> lbi = new ArrayList<ConditionInfo>();

            for (Element c : (List<Element>) cl.getChildren("condition")) {
                ConditionInfo ci = new ConditionInfo(null, c.getAttributeValue("type"), c.getAttribute("charno").getIntValue(), c.getAttributeValue("value"));
                lci.add(ci);
            }

            for (Element c : (List<Element>) cl.getChildren("basechange")) {
                /** @todo: remove duplicity **/
                Integer ch = null;

                if (c.getAttribute("charno") != null) {
                    ch = c.getAttribute("charno").getIntValue();
                }

                ConditionInfo bi = new ConditionInfo(c.getAttributeValue("no"),c.getAttributeValue("operation"), ch, c.getAttributeValue("value"));
                lbi.add(bi);
            }

            this.conditionLists.add(lci);
            this.baseInConditionLists.add(lbi);
        }

        for (Element c : (List<Element>) patternElement.getChildren("basechange")) {
                Integer ch = null;
                
                if (c.getAttribute("charno") != null) {
                    ch = c.getAttribute("charno").getIntValue();
                }

                ConditionInfo ci = new ConditionInfo(c.getAttributeValue("no"),c.getAttributeValue("operation"), ch, c.getAttributeValue("value"));
                baseLists.add(ci);
        }

        for (Element c : (List<Element>) patternElement.getChildren("form")) {
            boolean isLemma = false;

            if (c.getAttributeValue("lemma") != null && c.getAttributeValue("lemma").equals("yes")) {
                isLemma = true;
            }

            FormInfo fi = new FormInfo(c.getAttributeValue("base"), c.getChildTextTrim("prefix"), c.getChildTextTrim("suffix"), c.getChildTextTrim("tag"), c.getAttributeValue("post"), isLemma);
            formLists.add(fi);
        }
    }
}
