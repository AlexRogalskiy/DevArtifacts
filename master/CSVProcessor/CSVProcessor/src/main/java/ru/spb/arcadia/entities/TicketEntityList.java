/**
 * 
 */
package ru.spb.arcadia.entities;

import java.util.List;

import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Path;
import org.simpleframework.xml.Root;

/**
 * Entity class to store information on list of tickets
 * 
 * @author alexander.rogalskiy
 * @version 1.0
 * @since   2017-04-13
 *
 */
@Root(name="TDataRX")
public class TicketEntityList {
	@Path("TList")
	@ElementList(inline=true, name="TList", required=true, entry="T")
    private List<TicketEntity> entities;

	public List<TicketEntity> getEntities() {
		return entities;
	}

	public void setEntities(List<TicketEntity> entities) {
		this.entities = entities;
	}
}
