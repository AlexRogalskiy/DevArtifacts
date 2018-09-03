/**
 * 
 */
package ru.spb.arcadia;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;
import org.simpleframework.xml.stream.Format;

import com.opencsv.CSVReader;
import com.opencsv.bean.ColumnPositionMappingStrategy;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanFilter;
import com.opencsv.bean.HeaderColumnNameTranslateMappingStrategy;
import com.opencsv.bean.MappingStrategy;

import ru.spb.arcadia.entities.EventEntity;
import ru.spb.arcadia.entities.EventEntityList;
import ru.spb.arcadia.entities.TicketEntity;
import ru.spb.arcadia.entities.TicketEntityList;
import ru.spb.arcadia.entities.TicketStatus;
import ru.spb.arcadia.format.DateFormatter;

/**
 * Main class to handle basic CSV converter operations
 * 
 * @author alexander.rogalskiy
 * @version 1.0
 * @param <T>
 * @since   2017-04-13
 *
 */
public class CSVprocessor {
	private final Logger LOGGER = LogManager.getLogger(CSVprocessor.class);
	private static final char DEFAULT_FIELD_DELIMETER = ';';
	private static final char DEFAULT_QUOTE_ESCAPE_CHARACTER = '\'';
	private static final char DEFAULT_ESCAPE_CHARACTER = '\\';
	
	private static final String DEFAULT_OUTPUT_FILE_EXTENSION = ".xml";
	private static final String DEFAULT_INPUT_FILE_EXTENSION = ".csv";
	
	private static final String DEFAULT_TICKET_FILE_MARKER = "Tickets2ACS";
	private static final String DEFAULT_EVENT_FILE_MARKER = "Events2ACS";
	
	private static final String DEFAULT_FILE_ENCODING = "Cp1251";
	
	private CmdLineProcessor cmdProcessor = null;
	
	public static void main(String[] args) {
		new CSVprocessor().init(args);
	}
	
	private void init(String[] args) {
		cmdProcessor = new CmdLineProcessor(args);
		
		if(null != cmdProcessor.getInputSource()) {
			createTicketEntry();
			createEventEntry();
		}
		
		if(null != cmdProcessor.getInputSourceDir()) {
			processDirectory();
		}
	}

	public List<String[]> readAll(File fileName) {
		CSVReader reader = this.getCSVReader(fileName);
        List<String[]> entryList = new ArrayList<String[]>();
		try {
			entryList = reader.readAll();
			closeReader(reader);
		} catch (IOException e) {
			LOGGER.error("Error occured while reading from file stream < " + fileName.getAbsolutePath() + " > :" + e.getMessage());
		}
		return entryList;
	}
	
	private char getCSVFieldDelimiter() {
		return (null == cmdProcessor.getDelimiter() ? DEFAULT_FIELD_DELIMETER : cmdProcessor.getDelimiter());
	}
	
	public CSVReader getCSVReader(String fileName) {
		return this.getCSVReader(fileName, getCSVFieldDelimiter(), DEFAULT_QUOTE_ESCAPE_CHARACTER, DEFAULT_ESCAPE_CHARACTER);
	}
	
	public CSVReader getCSVReader(File fileName) {
		return this.getCSVReader(fileName, getCSVFieldDelimiter(), DEFAULT_QUOTE_ESCAPE_CHARACTER, DEFAULT_ESCAPE_CHARACTER);
	}
	
	public CSVReader getCSVReader(String fileName, char separator, char quoteEscapeChar, char escapeChar) {
		return this.getCSVReader(new File(fileName), separator, quoteEscapeChar, quoteEscapeChar);
	}
	
	public CSVReader getCSVReader(File fileName, char separator, char quoteEscapeChar, char escapeChar) {
		CSVReader reader = null;
		try {
			Reader fileReader = new InputStreamReader(new FileInputStream(fileName), DEFAULT_FILE_ENCODING);
			reader = new CSVReader(fileReader, separator, quoteEscapeChar, escapeChar);
			//reader = new CSVReader(new FileReader(fileName), CSVReader.DEFAULT_SEPARATOR, CSVReader.DEFAULT_QUOTE_CHARACTER, 0);
		} catch (FileNotFoundException e) {
			LOGGER.error("Error occured while initializing CSV reader for file < " + fileName + " > :" + e.getMessage());
		} catch (UnsupportedEncodingException e) {
			LOGGER.error("Error occured while initializing uncorrect character encoding for file < " + fileName + " > :" + e.getMessage());
		}
		return reader;
	}
	
	private <T> List<T> getEntityListByPosition(CSVReader reader, String[] columns, Class<T> type) {
		List<T> entityList = new ArrayList<T>();
		if(null != reader) {
			ColumnPositionMappingStrategy<T> mapping = new ColumnPositionMappingStrategy<T>();
			mapping.setType(type);
			mapping.setColumnMapping(columns);
			
		    CsvToBean<T> csvToBean = new CsvToBean<T>();
		    entityList = csvToBean.parse(mapping, reader);
	    }
	    return entityList;
	}
	
	private <T> List<T> getEntityListByName(CSVReader reader, Map<String, String> columnMap, Class<T> type) {
		List<T> entityList = new ArrayList<T>();
		if(null != reader) {
			HeaderColumnNameTranslateMappingStrategy<T> mapping = new HeaderColumnNameTranslateMappingStrategy<T>();
			mapping.setType(type);
			mapping.setColumnMapping(columnMap);
			
		    CsvToBean<T> csvToBean = new CsvToBean<T>();
		    entityList = csvToBean.parse(mapping, reader);
	    }
	    return entityList;
	}
	
	private List<TicketEntity> getTicketEntityList(CSVReader reader) {
		String[] columns = new String[] {"id", null, "eventId", null, null, null, "areaText", "row", "seat", "barcode"};
		return this.getEntityListByPosition(reader, columns, TicketEntity.class);
	}
	
	 private class EventFilter implements CsvToBeanFilter {
		 	private final MappingStrategy<EventEntity> strategy;
		 	private int rowNumber = 1;

		 	public EventFilter(MappingStrategy<EventEntity> strategy) {
		 		this.strategy = strategy;
		 	}

		 	public boolean allowLine(String[] line) {
		 		if(1 == rowNumber) {
		 			rowNumber++;
		 			return true;
		 		}
		 		return false;
		 	}
	 }

	private List<EventEntity> getEventEntityList(CSVReader reader) {
		List<EventEntity> eventList = new ArrayList<EventEntity>();
		if(null != reader) {
			ColumnPositionMappingStrategy<EventEntity> mapping = new ColumnPositionMappingStrategy<EventEntity>();
			mapping.setType(EventEntity.class);
			String[] columns = new String[] {null, "VenueCode", "id", "title", "dateBegin", "dateEnd", null, null, null, null};
			mapping.setColumnMapping(columns);
			
			CsvToBeanFilter filter = new EventFilter(mapping);
		    CsvToBean<EventEntity> csvToBean = new CsvToBean<EventEntity>();
		    eventList = csvToBean.parse(mapping, reader, filter);
	    }
	    return eventList;
	}
	
	private List<TicketEntity> portTicketEntityList(CSVReader reader) {
		List<TicketEntity> ticketList = this.getTicketEntityList(reader);
		if(null != ticketList) {
			for(TicketEntity ticket : ticketList) {
				//ticket.setEntryText("");
				ticket.setStatus(TicketStatus.VALID.getValue());
				ticket.setCReason("0");
			}
		}
		return ticketList;
	}
	
	private List<EventEntity> portEventEntityList(CSVReader reader) {
		List<EventEntity> eventList = this.getEventEntityList(reader);
		if(null != eventList) {
			for(EventEntity event : eventList) {
				Date dateBegin = DateFormatter.stringToDate(event.getDateBegin(), "m/d/yyyy HH:mm:ss aaa");
				Date dateEnd = DateFormatter.stringToDate(event.getDateEnd(), "m/d/yyyy HH:mm:ss aaa");
				event.setDateBegin(DateFormatter.dateToString(dateBegin, "yyyy-MM-dd'T'HH:mm:ssZ"));
				event.setDateEnd(DateFormatter.dateToString(dateEnd, "yyyy-MM-dd'T'HH:mm:ssZ"));
			}
		}
		return eventList;
	}

	private void createEventEntry() {
		this.createEventEntry(getCSVReader(cmdProcessor.getInputSource()));
	}
	
	private void createEventEntry(CSVReader reader) {
		List<EventEntity> eventList = this.portEventEntityList(reader);
		if(null != eventList) {
			for(EventEntity event : eventList) {
				EventEntityList entityList = new EventEntityList();
				entityList.setEntities(Arrays.asList(event));
				this.writeEventList(cmdProcessor.getOutputSourceDir(), entityList);
			}
		}
	}
	
	private void createTicketEntry() {
		this.createTicketEntry(getCSVReader(cmdProcessor.getInputSource()));
	}
	
	private void createTicketEntry(CSVReader reader) {
		List<TicketEntity> ticketList = this.portTicketEntityList(reader);
		if(null != ticketList) {
			for(TicketEntity ticket : ticketList) {
				TicketEntityList entityList = new TicketEntityList();
				entityList.setEntities(Arrays.asList(ticket));
				this.writeTicketList(cmdProcessor.getOutputSourceDir(), entityList);
			}
		}
	}
	
	private void processDirectory() {
		List<String> fileList = this.readDirectory();
		for(String fileName : fileList) {
			CSVReader reader = getCSVReader(fileName);
			createEventEntry(reader);
			createTicketEntry(reader);
			closeReader(reader);
		}
	}
	
	private List<String> readDirectory() {
		List<String> fileList = new ArrayList<String>();
		if(null != cmdProcessor.getInputSourceDir()) {
			this.readDirectoryFiles(cmdProcessor.getInputSourceDir(), fileList);
		}
		return fileList;
	}
	
	private void readDirectoryFiles(final File dirName, final List<String> fileList) {
		for (final File fileEntry : dirName.listFiles()) {
	        if (fileEntry.isDirectory()) {
	        	this.readDirectoryFiles(fileEntry, fileList);
	        } else {
	            if(fileEntry.isFile() && fileEntry.getName().contains(DEFAULT_INPUT_FILE_EXTENSION)) {
	            	fileList.add(fileEntry.getAbsolutePath() + "\\" + fileEntry.getName());
				}
	        }
	    }
	}
	
	private String createFileName(File dirName, String fileMarker) throws IOException {
		if(null == dirName) {
			throw new IOException("ERROR: not valid directory name < " + dirName + " >");
		}
		if(!dirName.exists()) {
			if (dirName.mkdirs()) {
				LOGGER.info("Directory < " + dirName.getAbsolutePath() + " > has been successfully created");
            } else {
            	LOGGER.info("ERROR: failed to create directory < " + dirName.getAbsolutePath() + " >");
            	throw new IOException("ERROR: failed to create directory < " + dirName.getAbsolutePath() + " >");
            }
		}
		if(!dirName.isDirectory()) {
			throw new IOException("ERROR: not valid directory path < " + dirName.getAbsolutePath() + " >");
		}
		String fileDate = DateFormatter.dateToString(new Date(), "yyyyMMddHHmmssSSS");
		String name = dirName.getAbsolutePath() + "\\" + fileMarker + fileDate + DEFAULT_OUTPUT_FILE_EXTENSION;
		return name;
	}
	
	private void writeTicketList(File dirName, TicketEntityList entity) {
		try {
			String name = createFileName(dirName, DEFAULT_TICKET_FILE_MARKER);
			this.write(entity, new File(name));
		} catch (IOException e) {
			LOGGER.error("ERROR: cannot write input stream to output source < " + dirName + " > :" + e.getMessage());
		}
	}
	
	private void writeEventList(File dirName, EventEntityList entity) {
		try {
			String name = createFileName(dirName, DEFAULT_EVENT_FILE_MARKER);
			this.write(entity, new File(name));
		} catch (IOException e) {
			LOGGER.error("ERROR: cannot write input stream to output source < " + dirName + " > :" + e.getMessage());
		}
	}
	
	public void write(Object source, File fileName) {
		this.write(source, fileName, StandardCharsets.UTF_8);
	}
	
	private void write(Object source, File fileName, Charset charset) {
		String prolog = "<?xml version=\"1.0\" encoding=\"" + charset.displayName() + "\"?>";
		Serializer serializer = new Persister(new Format(2, prolog));
		try {
			Writer outputStream = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(fileName), DEFAULT_FILE_ENCODING));
			serializer.write(source, outputStream);
			outputStream.close();
		} catch (FileNotFoundException e) {
			LOGGER.error("File not found < " + fileName.getAbsolutePath() + " > :" + e.getMessage());
		} catch (IOException e) {
			LOGGER.error("Error occured while writing Entity to file < " + fileName.getAbsolutePath() + " > :" + e.getMessage());
		} catch (Exception e) {
			LOGGER.error("Error occured while operating with output stream < " + fileName.getAbsolutePath() + " > :" + e.getMessage());
		}
	}
	
	private void closeReader(CSVReader reader) {
		if(null != reader) {
			try {
				reader.close();
			} catch (IOException e) {
				LOGGER.error("Error occured while closing CSVReader:" + e.getMessage());
			}
		}
	}
}
