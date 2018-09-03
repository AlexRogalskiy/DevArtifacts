package ru.spb.arcadia.format;

import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.zip.GZIPInputStream;

/**
 * Helper class to handle string format operations / gzip, ungzip, convert to/from "UTF-8" /
 * 
 * @author alexander.rogalskiy
 * @version 1.0
 * @since 2017-11-17
 *
 */
public class StringFormatter {
	/**
	 * Ungzip compressed string to raw format string output
	 * 
	 * @param str
	 *            input string.
	 * @return String ungzipped raw string.
	 * @exception Exception
	 *                On unzip operation.
	 * @see Exception
	 */
	public static String ungzip(String str) throws Exception {
		if(null == str) {
			return null;
		}
		return StringFormatter.ungzip(str.getBytes(StandardCharsets.UTF_8));
	}

	/**
	 * Ungzip compressed array of bytes to raw format string output
	 * 
	 * @param bytes
	 *            input array of bytes.
	 * @return String ungzipped raw string.
	 * @exception Exception
	 *                On unzip operation.
	 * @see Exception
	 */
	public static String ungzip(byte[] bytes) throws Exception {
		if (isGZIPStream(bytes)) {
			InputStreamReader isr = new InputStreamReader(new GZIPInputStream(new ByteArrayInputStream(bytes)),
					StandardCharsets.UTF_8);
			StringWriter sw = new StringWriter();
			char[] chars = new char[1024];
			for (int len; (len = isr.read(chars)) > 0;) {
				sw.write(chars, 0, len);
			}
			return sw.toString();
		} else {
			return (new String(bytes, 0, bytes.length, StandardCharsets.UTF_8));
		}
	}

	/**
	 * Check whether input array of bytes is GZIP formatted or not
	 * 
	 * @param bytes
	 *            input array of bytes.
	 * @return boolean true - if GZIP formatted, false - otherwise.
	 */
	private static boolean isGZIPStream(byte[] bytes) {
		if(null == bytes || 0 == bytes.length) return false;
		return (bytes[0] == (byte) GZIPInputStream.GZIP_MAGIC)
				&& (bytes[1] == (byte) (GZIPInputStream.GZIP_MAGIC >>> 8));
	}

	/**
	 * Convert input string from ISO-8859-1 to UTF-8 format
	 * 
	 * @param str
	 *            input string.
	 * @return String result string.
	 */
	public static String convertLatin1ToUTF8(String str) {
		if(null == str) {
			return null;
		}
		String out = null;
		try {
			out = new String(str.getBytes("ISO-8859-1"), "UTF-8");
		} catch (java.io.UnsupportedEncodingException e) {
			return null;
		}
		return out;
	}

	/**
	 * Convert input string from UTF-8 to ISO-8859-1 format
	 * 
	 * @param str
	 *            input string.
	 * @return String result string.
	 */
	public static String convertUTF8ToLatin1(String str) {
		if(null == str) {
			return null;
		}
		String out = null;
		try {
			out = new String(str.getBytes("UTF-8"), "ISO-8859-1");
		} catch (java.io.UnsupportedEncodingException e) {
			return null;
		}
		return out;
	}
	
	/**
	 * Convert input string from Windows-1251 to UTF-8 format
	 * 
	 * @param str
	 *            input string.
	 * @return String result string.
	 */
	public static String convertCP1251ToUTF8(String str) {
		if(null == str) {
			return null;
		}
		String out = null;
		try {
			out = new String(str.getBytes("Cp1251"), "UTF-8");
		} catch (java.io.UnsupportedEncodingException e) {
			return null;
		}
		return out;
	}
	
	/**
	 * Convert input string from UTF-8 to Windows-1251 format
	 * 
	 * @param str
	 *            input string.
	 * @return String result string.
	 */
	public static String convertUTF8ToCP1251(String str) {
		if(null == str) {
			return null;
		}
		String out = null;
		try {
			out = new String(str.getBytes("UTF-8"), "Cp1251");
		} catch (java.io.UnsupportedEncodingException e) {
			return null;
		}
		return out;
	}

	/**
	 * Convert input string to UTF-8 format
	 * 
	 * @param str
	 *            input string.
	 * @return String result string.
	 */
	public static String convertToUTF8(String str) {
		if(null == str) {
			return null;
		}
		String out = null;
		try {
			out = new String(str.getBytes("UTF-8"), "UTF-8");
		} catch (java.io.UnsupportedEncodingException e) {
			return null;
		}
		return out;
	}
	
	/**
	 * Configure rightly-formed URL
	 * 
	 * @param url input URL.
	 * 
	 * @return String rightly-formed URL.
	 */
	public static String createURL(String url) {
		if(null == url || 0 == url.length()) {
			return null;
		}
	    if (url.charAt(url.length()-1) == '/') {
	    	url = url.substring(0, url.length()-1);
	    }
	    if (!url.matches("^(?:f|ht)tps?://.*")) {
	        url = "http://" + url;
	    }
	    return url;
	}
}
