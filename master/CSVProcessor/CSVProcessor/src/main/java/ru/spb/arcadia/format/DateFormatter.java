/**
 * 
 */
package ru.spb.arcadia.format;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Helper class to handle date format operations
 * 
 * @author alexander.rogalskiy
 * @version 1.0
 * @since   2017-11-17
 *
 */
public class DateFormatter {
    /**
     * Default datetime format string
     */
	public static final String DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    /**
     * Default date format instance
     */
	private static SimpleDateFormat ft = new SimpleDateFormat(DEFAULT_DATETIME_FORMAT);
	
    /**
     * Format data to string using particular format
     * @param date date.
     * @return String.
     */
    public static String dateToString(Date date) {
    	return ft.format(date).toString();
    }
    
    /**
     * Format string to date using particular format
     * @param date date.
     * @return Date.
     */
    public static Date stringToDate(String date) {
    	try {
			return ft.parse(date);
		} catch (ParseException ex) {
			throw new IllegalArgumentException("Cannot convert string to date: " + ex.toString());
		}
    }
    
    /**
     * Format data to string using particular format
     * @param date date.
     * @param dateFormat format string.
     * @return String.
     */
    public static String dateToString(Date date, String dateFormat) {
    	return (new SimpleDateFormat(dateFormat)).format(date).toString();
    }
    
    /**
     * Format string to date using particular format
     * @param date date.
     * @param dateFormat format string.
     * @return Date.
     */
    public static Date stringToDate(String date, String dateFormat) {
    	try {
			return (new SimpleDateFormat(dateFormat)).parse(date);
		} catch (ParseException ex) {
			throw new IllegalArgumentException("Cannot convert string to date: " + ex.toString());
		}
    }
}
