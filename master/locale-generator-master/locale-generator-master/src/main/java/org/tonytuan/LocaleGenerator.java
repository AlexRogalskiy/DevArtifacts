package org.tonytuan;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Properties;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class LocaleGenerator {

	public static void main(String[] args) throws IOException {
		boolean isUnicode = false;
		boolean isRemoveInputFileOnComplete = false;
		int rowNum;
		int colNum;

		Properties prop = new Properties();

		try {
			prop.load(new FileInputStream("config.txt"));
		} catch (IOException ex) {
			ex.printStackTrace();
		}

		String inputFilePath = prop.getProperty("inputFile");
		String outputDirectory = prop.getProperty("outputDirectory");

		// optional
		String unicode = prop.getProperty("unicode");
		String removeInputFileOnComplete = prop
				.getProperty("removeInputFileOnComplete");

		inputFilePath = inputFilePath.trim();
		outputDirectory = outputDirectory.trim();
		new File(outputDirectory).mkdirs();

		if (unicode != null) {
			isUnicode = Boolean.parseBoolean(unicode.trim());
		}
		if (removeInputFileOnComplete != null) {
			isRemoveInputFileOnComplete = Boolean
					.parseBoolean(removeInputFileOnComplete.trim());
		}

		Writer out = null;
		FileInputStream in = null;
		final String newLine = System.getProperty("line.separator").toString();
		try {
			in = new FileInputStream(inputFilePath);

			Workbook workbook = new XSSFWorkbook(in);

			Sheet sheet = workbook.getSheetAt(0);

			rowNum = sheet.getLastRowNum() + 1;
			colNum = sheet.getRow(0).getPhysicalNumberOfCells();

			for (int j = 1; j < colNum; ++j) {
				String outputFilename = sheet.getRow(0).getCell(j)
						.getStringCellValue();
				String outputPath = FilenameUtils.concat(outputDirectory,
						outputFilename);
				System.out.println("--Writing " + outputPath);
			
				out = new OutputStreamWriter(new FileOutputStream(outputPath),
						"UTF-8");

				for (int i = 1; i < rowNum; i++) {
					try {
						String key = sheet.getRow(i).getCell(0)
								.getStringCellValue();
						String value = sheet.getRow(i).getCell(j)
								.getStringCellValue();
						if (!key.equals("") && !value.equals("")) {
							String line = key + "=";
							line += isUnicode ? StringEscapeUtils
									.escapeJava(value) : value;

							System.out.println(line);
							out.write(line + newLine);
						}

					} catch (Exception e) {
						// just ignore empty rows
					}

				}
				out.close();
			}
			in.close();

			System.out.println("\n---Complete!---");
			System.out.println("Read input file from " + inputFilePath);
			System.out.println(colNum - 1 + " output files ate generated at "
					+ outputDirectory);
			System.out.println(rowNum
					+ " records are generated for each output file.");
			System.out.println("output file is ecoded as unicode? "
					+ (isUnicode ? "yes" : "no"));
			if (isRemoveInputFileOnComplete) {
				File input = new File(inputFilePath);
				input.deleteOnExit();
				System.out.println("Deleted " + inputFilePath);
			}

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				in.close();
			}
		}

	}
}
