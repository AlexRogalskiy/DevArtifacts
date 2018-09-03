package org.eroese.vowels;

/**
 * Thrown if IOException occures while getting next word
 *
 * @author eirnym
 */
public class WordReaderException extends RuntimeException {
    public WordReaderException() {
    }

    public WordReaderException(String message) {
        super(message);
    }

    public WordReaderException(String message, Throwable cause) {
        super(message, cause);
    }

    public WordReaderException(Throwable cause) {
        super(cause);
    }

    public WordReaderException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
