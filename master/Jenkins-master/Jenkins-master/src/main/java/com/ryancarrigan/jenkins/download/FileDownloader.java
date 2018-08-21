package com.ryancarrigan.jenkins.download;

import com.ryancarrigan.jenkins.data.JenkinsXMLFile;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.*;
import java.util.Random;

/**
 * com.ryancarrigan.jenkins.build
 *
 * @author Ryan P. Carrigan
 * @since 5/22/14.
 */
public class FileDownloader {
    private final static String TEMP_FILE_NAME = "temp";
    private final static String FILE_EXTENSION = ".xml";
    private static Logger log = LoggerFactory.getLogger(JenkinsXMLFile.class);
    private String url;

    public FileDownloader(final String url) {
        this.url = getApiRequest(url);
    }

    public Document getDocument() {
        return getDocument(getFile(url));
    }

    public static Document getDocument(final File file) {
        try {
            final Document document = new SAXBuilder().build(file);
            log.trace(String.format("Returning <%s> document", document.getRootElement().getName()));
            return document;
        } catch (final JDOMException e) {
            log.error("JDOM Exception", e);
        } catch (IOException e) {
            log.error("IO Exception", e);
        }
        return null;
    }

    private File getFile(final String remoteFile) {
        log.info(String.format("Downloading document: <%s>", url));
        final File outputFile = new File(TEMP_FILE_NAME + new Random().nextInt(999) + FILE_EXTENSION);
        if (!outputFile.exists() && !outputFile.isDirectory()) {
            final InputStream inputStream = getInputStream(url);
            final BufferedOutputStream outputStream = getOutputStream(outputFile);
            try {
                if (outputFile.createNewFile())
                    throw new NullPointerException("Error creating jenkins");

                Integer bytesIn;
                while ((bytesIn = inputStream.read()) >= 0)
                    outputStream.write(bytesIn);
                outputStream.close();
                inputStream.close();
            } catch (IOException ioe) {
                log.error("IO Exception", ioe);
            }
        }
        return outputFile;
    }

    private BufferedInputStream getInputStream(final String url) {
        log.trace("Executing HTTP request...");
        try {
            final HttpResponse response = HttpClients.createDefault().execute(new HttpGet(url));
            log.trace("Received HTTP response");
            return new BufferedInputStream(response.getEntity().getContent());
        } catch (final ClientProtocolException e) {
            log.error("Client Protocol Exception", e);
        } catch (final IOException e) {
            log.error("IO Exception", e);
        }
        throw new NullPointerException("Could not get input jenkins");
    }

    private BufferedOutputStream getOutputStream(final File file) {
        try {
            return new BufferedOutputStream(new FileOutputStream(file));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        throw new NullPointerException("Could not get output jenkins.");
    }

    private String getApiRequest(final String url) {
        return String.format("%sapi/xml?depth=2", url);
    }
}
