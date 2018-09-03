/**
 * 
 */
package ru.spb.arcadia.entities;

/**
 * Enum class to store information on ticket status
 * 
 * @author alexander.rogalskiy
 * @version 1.0
 * @since 2017-03-30
 *
 */
public enum TicketStatus {
    VALID("V"),
    CANCEL("S");

    private final String value;

    private TicketStatus(final String newValue) {
        value = newValue;
    }

    public String getValue() {
    	return value;
    }
    
    public static TicketStatus fromValue(String value) {
        for (TicketStatus event : TicketStatus.values()) {
            if (event.value.equals(value)) {
            	return event;
            }
        }
        throw new IllegalArgumentException(value);
    }
    
    @Override
    public String toString() {
    	return value;
    }
}