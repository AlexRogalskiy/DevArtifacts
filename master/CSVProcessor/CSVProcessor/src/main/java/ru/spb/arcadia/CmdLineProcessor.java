/**
 * 
 */
package ru.spb.arcadia;

import java.io.File;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;
import org.kohsuke.args4j.OptionHandlerFilter;

/**
 * Class to process input CLI arguments
 * 
 * @author alexander.rogalskiy
 * @version 1.0
 * @since   2017-04-13
 *
 */
public class CmdLineProcessor {
	private final Logger LOGGER = LogManager.getLogger(CmdLineProcessor.class);
	
	@Option(name = "-i", aliases = { "--input" }, required = true, usage = "input csv file", metaVar="INPUT FILE")
	private File inputSource;
	@Option(name = "-odir", aliases = { "--outputDir" }, required = true, usage = "output directory", metaVar="OUTPUT DIR")
	private File outputSourceDir;
	@Option(name = "-idir", aliases = { "--inputDir" }, required = false, usage = "input directory", metaVar="INPUT DIR")
	private File inputSourceDir;
	@Option(name = "-delim", aliases = { "--delimiter" }, required = false, usage = "csv field delimiter", metaVar="FIELD DELIMITER")
	private Character delimeter;
	
	private boolean errorFlag = false;

	public CmdLineProcessor(String... args) {
		 CmdLineParser parser = new CmdLineParser(this);
	     try {
	    	 parser.parseArgument(args);

	    	 if (null != getInputSource() && null != getInputSourceDir()) {
	    		 throw new CmdLineException(parser, "Invalid Argument: either --input or --inputDir should be specified.", null);
	    	 }
	    	 
	         if (null != getInputSource() && !getInputSource().isFile()) {
	        	 throw new CmdLineException(parser, "Invalid Argument: --input is no valid input file.", null);
	         }
	         
	         if (null == getOutputSourceDir() || !getOutputSourceDir().isDirectory()) {
	        	 throw new CmdLineException(parser, "Invalid Argument: --outputDir is no valid output directory.", null);
	         }
	         
	         if (null != getInputSourceDir() && !getInputSourceDir().isDirectory()) {
	        	 throw new CmdLineException(parser, "Invalid Argument: --inputDir is no valid input directory.", null);
	         }
	         
	         if (null != getDelimiter() && !Character.isDefined(getDelimiter())) {
	        	 throw new CmdLineException(parser, "Invalid Argument: --delimiter is no valid csv field delimiter.", null);
	         }
	         errorFlag = true;
	      } catch (CmdLineException e) {
	    	  LOGGER.error("Error occured while parsing input arguments with message: " + e.getMessage());
	          LOGGER.error("Example: java " + CSVprocessor.class.getName() + parser.printExample(OptionHandlerFilter.ALL));
	      }
	 }

	 /**
	  * Returns whether the parameters could be parsed without an error.
	  *
	  * @return true if no error occurred.
	  */
	  public boolean isErrorFree() {
		  return this.errorFlag;
	  }

	  /**
	   * Returns the input source file.
	   *
	   * @return The input source file.
	   */
	  public File getInputSource() {
		  return this.inputSource;
	  }
	  
	  /**
	   * Returns the input source directory.
	   *
	   * @return The input source directory.
	   */
	  public File getInputSourceDir() {
		  return this.inputSourceDir;
	  }
	  
	  /**
	   * Returns the output source directory.
	   *
	   * @return The output source directory.
	   */
	  public File getOutputSourceDir() {
		  return this.outputSourceDir;
	  }
	  
	  /**
	   * Returns the delimiter of fields.
	   *
	   * @return The delimiter.
	   */
	  public Character getDelimiter() {
		  return this.delimeter;
	  }
}
