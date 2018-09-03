/**
 * 
 */
package ru.spb.arcadia.entities;

import org.simpleframework.xml.Attribute;
import org.simpleframework.xml.Element;
import org.simpleframework.xml.Root;

/**
 * Entity class to store information on ticket
 * 
 * @author alexander.rogalskiy
 * @version 1.0
 * @since   2017-04-13
 *
 */
@Root(name="T", strict=false)
public class TicketEntity {
	/**
	 * Уникальный идентификатор мероприятия 
	 */
	@Attribute(name="ID", required=true)
    private String id;
	/**
	 * Идентификатор билета в БС
	 */
	@Element(name="EvID", required=true)
	private String eventId;
	/**
	 * Штрих-код билета
	 */
	@Element(name="BC", required=true)
	private String barcode;
	/**
	 * Номер сектора на объекте
	 */
	@Element(name="AreaText", required=false)
	private String areaText;
	/**
	 * Вход
	 */
	@Element(name="EntryText", required=false)
	private String entryText;
	/**
	 * Ряд
	 */
	@Element(name="Row", required=false)
	private String row;
	/**
	 * Место
	 */
	@Element(name="Seat", required=false)
	private String seat;
	/**
	 * Статус билета: активный / отмененный
	 */
	@Element(name="Status")
	private String status;
	/**
	 * Описание причины отмены билета
	 */
	@Element(name="CReason", required=false)
	private String cReason;
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getEventId() {
		return eventId;
	}
	
	public void setEventId(String eventId) {
		this.eventId = eventId;
	}
	
	public String getBarcode() {
		return barcode;
	}
	
	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}
	
	public String getAreaText() {
		return areaText;
	}
	
	public void setAreaText(String areaText) {
		this.areaText = areaText;
	}
	
	public String getEntryText() {
		return entryText;
	}
	
	public void setEntryText(String entryText) {
		this.entryText = entryText;
	}
	
	public String getRow() {
		return row;
	}
	
	public void setRow(String row) {
		this.row = row;
	}
	
	public String getSeat() {
		return seat;
	}
	
	public void setSeat(String seat) {
		this.seat = seat;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getCReason() {
		return cReason;
	}
	
	public void setCReason(String cReason) {
		this.cReason = cReason;
	}
}
