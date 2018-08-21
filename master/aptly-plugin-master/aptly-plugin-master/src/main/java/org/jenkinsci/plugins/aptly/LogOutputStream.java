package org.jenkinsci.plugins.aptly;

import java.io.IOException;
import java.io.PrintStream;
import java.util.logging.Logger;

/**
* Helper class to profide a PrintStream for AptlyRestClient during
* logging checking
*
*/
public class LogOutputStream extends java.io.OutputStream {

    static  Logger logger = Logger.getLogger(LogOutputStream.class.getName());
    private char lineSeparatorEnd = '\n';
    private String lineSeparator = System.getProperty("line.separator");
    private StringBuffer buffer = new StringBuffer();

    @Override
    public void write(int b) throws IOException {
        char ch = (char) b;
        this.buffer.append(ch);
        if (ch == this.lineSeparatorEnd) {
            // Check on a char by char basis for speed
            String s = buffer.toString();
            if (s.indexOf(lineSeparator) != -1) {
                // The whole separator string is written
                logger.info(s.substring(0, s.length() - lineSeparator.length()));
                buffer.setLength(0);
            }
        }
    }
}

