package org.eroese.vowels;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

/**
 * Main program logic
 *
 * @author eirnym
 */
public interface Logic {
    String OUTPUT_FORMAT = "(%s, %s) -> %s\n";

    /**
     * Reads words from filename and returns average count
     *
     * @param filename filename to read
     * @return average counts
     * @throws IOException on IO errors
     *
     * @see {@link #getInputReader(String)}
     */
    Map<Vowels, Double> readCounts(final String filename) throws IOException;

    /**
     * Writes results to file
     * @param results results to write
     * @param filename filename to use for writing
     * @throws IOException on IO errors
     *
     * @see {@link #getOutputStream(String)}
     */
    void writeCounts(Map<Vowels, Double> results, final String filename) throws IOException;

    /**
     * Counts vowels for given word
     * @param word word to scan
     * @return vowels count
     */
    VowelCount count(final String word);

    /**
     * Opens buffered reader for file with given filename.
     *
     * There may be special filenames like "-".
     *
     * @param filename file name to open
     * @return reader
     * @throws IOException if file can't be opened for reading
     */
    BufferedReader getInputReader(String filename) throws IOException;

    /**
     * Opens output stream for file with given filename.
     *
     * There may be special filenames like "-".
     *
     * @param filename file name to open
     * @return output stream
     * @throws IOException if file can't be opened for writing
     */
    OutputStream getOutputStream(String filename) throws IOException;
}
