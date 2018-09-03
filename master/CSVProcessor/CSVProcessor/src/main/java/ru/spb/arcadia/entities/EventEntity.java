/**
 * 
 */
package ru.spb.arcadia.entities;

import org.simpleframework.xml.Attribute;
import org.simpleframework.xml.Element;
import org.simpleframework.xml.Root;

/**
 * Entity class to store information on event
 * 
 * @author alexander.rogalskiy
 * @version 1.0
 * @since   2017-04-13
 *
 */
@Root(name="Event", strict=false)
public class EventEntity {
	/**
	 * Уникальный идентификатор мероприятия 
	 */
	@Attribute(name="ID", required=true)
    private String id;
	/**
	 * Код места проведения мероприятия 
	 */
	@Element(name="VenueCode", required=false)
    private String venueCode;
	/**
	 * Дата и время начала мероприятия (YYYY-MM-DDThh:mmTZD)
	 */
	@Element(name="Date", required=true)
	private String dateBegin;
	/**
	 * Дата и время окончания мероприятия (YYYY-MM-DDThh:mmTZD)
	 */
	@Element(name="DateEnd", required=true)
	private String dateEnd;
	/**
	 * Наименование мероприятия
	 */
	@Element(name="Title", required=true)
	private String title;
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getVenueCode() {
		return venueCode;
	}
	
	public void setVenueCode(String venueCode) {
		this.venueCode = venueCode;
	}
	
	public String getDateBegin() {
		return dateBegin;
	}
	
	public void setDateBegin(String dateBegin) {
		this.dateBegin = dateBegin;
	}
	
	public String getDateEnd() {
		return dateEnd;
	}
	
	public void setDateEnd(String dateEnd) {
		this.dateEnd = dateEnd;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
}
