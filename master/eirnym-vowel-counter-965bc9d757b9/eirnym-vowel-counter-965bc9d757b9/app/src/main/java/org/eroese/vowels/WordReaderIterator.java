package org.eroese.vowels;


import java.io.BufferedReader;
import java.io.IOException;
import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Iterator which reads word by word from given reader.
 * Word contains only English letters, uppercase and lowercase.
 *
 * @author eirnym
 */
public class WordReaderIterator implements Iterator<String> {
    /**
     * Pattern to extract words
     */
    private static final Pattern pattern = Pattern.compile("[A-Za-z]+");

    /**
     * Reader to read data from
     */
    private BufferedReader reader;

    // current state:
    private String line;
    private Matcher matcher;
    private String word;
    private boolean finished = false;

    public WordReaderIterator(BufferedReader reader) {
        this.reader = reader;
        resetState();
    }

    @Override
    public boolean hasNext() {
        if (finished) {
            return false;
        }

        if (matcher == null) {
            try {
                line = reader.readLine();
            } catch (IOException e) {
                throw new WordReaderException("IOException while iterating", e);
            }

            if (line == null) { // no further input
                resetState(); // tell gc to free unused memory
                reader = null; // tell gc to free unused memory
                finished = true;
                return false;
            }

            matcher = pattern.matcher(line);
        }
        if (matcher.find()) {
            word = matcher.group();
            return true;
        }

        // we should go here to next line
        resetState();
        return hasNext();
    }

    @Override
    public String next() {

        if (word != null || hasNext()) {
            String value = word;
            word = null;
            return value;
        }

        throw new NoSuchElementException();
    }

    private void resetState() {
        matcher = null;
        line = null;
        word = null;
    }
}
