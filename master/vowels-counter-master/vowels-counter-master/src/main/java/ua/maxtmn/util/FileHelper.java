package ua.maxtmn.util;

import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Scanner;

/**
 * Provide additional util methods to file processing.
 * 
 * @author Tereshchenko
 * 
 */
public class FileHelper {

	private static final String WORDS_DELIMITERS_2_SKIP_REGEX = "[\\.,-]";

	public static Collection<String> readWordsFromFile(Path pathToFile)
			throws IOException {
		Collection<String> words = new ArrayList<>();
		try (Scanner scanner = new Scanner(pathToFile,
				StandardCharsets.UTF_8.name())) {
			while (scanner.hasNext()) {
				words.add(scanner.next().replaceAll(
						WORDS_DELIMITERS_2_SKIP_REGEX, ""));
			}
		}

		return words;

	}

	public static boolean writeResultToFile(String pathToFile,
			Collection<String> content) throws IOException {
		Writer writer = null;
		try {
			writer = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(pathToFile),
					StandardCharsets.UTF_8.name()));
			for (String line : content) {
				writer.write(line);
				((BufferedWriter) writer).newLine();
			}
		} finally {
			if (writer != null) {
				writer.flush();
				writer.close();
			}
		}
		return true;
	}

}
