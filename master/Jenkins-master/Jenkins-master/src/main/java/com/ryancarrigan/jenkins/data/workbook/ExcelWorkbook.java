package com.ryancarrigan.jenkins.data.workbook;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

/**
 * com.ryancarrigan.jenkins.data.workbook
 *
 * @author Ryan P. Carrigan
 * @since 6/1/14.
 */
public class ExcelWorkbook {
    private static final Logger log = LoggerFactory.getLogger(ExcelWorkbook.class);
    private static final Short DEFAULT_HEADER_FONT = 16;
    private static final String DEFAULT_SHEET_NAME = "Default Sheet";
    private Sheet currentSheet;
    private String outputFileName;
    private Workbook workbook;

    public ExcelWorkbook(final String outputFileName) {
        this.outputFileName = outputFileName;
        this.workbook = getExcelFile();
    }

    private Workbook getExcelFile() {
        if (!outputFileName.endsWith(".xlsx")) {
            outputFileName = outputFileName + ".xlsx";
        }
        final File file = new File(outputFileName);
        try {
            final OPCPackage opcPackage = OPCPackage.open(file);
            return new XSSFWorkbook(opcPackage);
        } catch (final IOException | InvalidFormatException e) {
            e.printStackTrace();
        }
        return new XSSFWorkbook();
    }

    public Row getRow(final Integer rowIndex) {
        return workbook.getSheetAt(0).getRow(rowIndex);
    }
}
