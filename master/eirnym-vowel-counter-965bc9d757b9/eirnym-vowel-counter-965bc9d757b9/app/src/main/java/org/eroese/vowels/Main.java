package org.eroese.vowels;

import java.io.IOException;
import java.util.Map;

/**
 * @author eirnym
 */
public class Main {
    /**
     * Default filename for input file
     */
    public static final String INPUT_DEFAULT = "input.txt";
    /**
     * Default filename for output file
     */
    public static final String OUTPUT_DEFAULT = "output.txt";

    /**
     * Argument index to check for different input filename
     */
    public static final int INPUT_FILE_ARGUMENT = 0;

    /**
     * Argument index to check for different output filename
     */
    public static final int OUTPUT_FILE_ARGUMENT = 1;

    public static void main(String[] args) throws IOException {
        Logic logic = new LogicImpl();
        final Map<Vowels, Double> counts = logic.readCounts(getArgument(args, INPUT_FILE_ARGUMENT, INPUT_DEFAULT));
        logic.writeCounts(counts, getArgument(args, OUTPUT_FILE_ARGUMENT, OUTPUT_DEFAULT));
    }

    /**
     * Returns argument with given index or default value
     * @param args program arguments
     * @param index index to check
     * @param defaultValue if there no such argument
     */
    public static String getArgument(final String[] args, int index, String defaultValue) {
        if (args.length > index) {
            String value = args[index];
            if (!value.isEmpty()) {
                return value;
            }
        }

        return defaultValue;
    }


}
