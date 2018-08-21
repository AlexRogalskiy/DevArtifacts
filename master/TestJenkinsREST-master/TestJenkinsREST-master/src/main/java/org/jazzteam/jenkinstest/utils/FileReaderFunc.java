package org.jazzteam.jenkinstest.utils;

import org.apache.log4j.Logger;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class FileReaderFunc {
    private static final Logger LOG = Logger.getLogger(FileReaderFunc.class);

    public String readFile(String property){
        String content = null;
        try {
            content = new Scanner(new File(PropertyHandler.getProperty(property))).useDelimiter("\\Z").next();
        } catch (FileNotFoundException e) {
            LOG.error("FileNotFoundException", e);
        }
        return content;
    }
}
