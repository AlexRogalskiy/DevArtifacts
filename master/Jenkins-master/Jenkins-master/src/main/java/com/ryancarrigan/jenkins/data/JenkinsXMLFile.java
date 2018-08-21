package com.ryancarrigan.jenkins.data;

import com.ryancarrigan.jenkins.download.FileDownloader;
import org.jdom2.Document;
import org.jdom2.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Suave Peanut on 5/22/14.
 */
public class JenkinsXMLFile {
    protected Element root;
    protected Logger log = LoggerFactory.getLogger(JenkinsXMLFile.class);

    public JenkinsXMLFile(final String url) {
        this.root = getDocument(url).getRootElement();
    }

    public JenkinsXMLFile(final Element element, final String... expectedNames) {
        this.root = element;
        isValidRootName(expectedNames);
    }

    public JenkinsXMLFile(final Document document, final String expectedRootName) {
        this(document.getRootElement(), expectedRootName);
    }

    private Boolean isValidRootName(final String... expectedNames) {
        final String actualRootName = root.getName();
        final StringBuilder nameOutput = new StringBuilder();
        for (final String name : expectedNames) {
            if (actualRootName.equals(name))
                return true;
            else nameOutput.append(String.format("(%s)", name));
        }
        log.error(String.format("Invalid input jenkins. Expected: <%s> Actual: <%s>",
                nameOutput.toString(), root.getName()));
        return false;
    }

    protected Document getDocument(final String url) {
        return new FileDownloader(url).getDocument();
    }

    private Element getActionChild(final String child) {
        for (final Element action : root.getChildren("action")) {
            final Element descendant = action.getChild(child);
            if (null != descendant)
                return descendant;
        }
        throw new NullPointerException("Unable to identify child");
    }

}
