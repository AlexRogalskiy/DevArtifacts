package org.eroese.vowels;

import java.io.BufferedReader;
import java.io.Reader;
import java.util.Iterator;

/**
 * Iterable object to use with for-each.
 *
 * @author eirnym
 */
public class WordReaderIterable implements Iterable<String>{
    private final BufferedReader reader;

    public WordReaderIterable(Reader reader) {
        if (reader instanceof BufferedReader) {
            this.reader = (BufferedReader) reader;
        } else {
            this.reader = new BufferedReader(reader);
        }
    }

    @Override
    public Iterator<String> iterator() {
        return new WordReaderIterator(reader);
    }
}
