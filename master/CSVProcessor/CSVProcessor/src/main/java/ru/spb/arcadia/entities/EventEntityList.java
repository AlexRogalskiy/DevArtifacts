/**
 * 
 */
package ru.spb.arcadia.entities;

import java.util.List;

import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Path;
import org.simpleframework.xml.Root;

/**
 * Entity class to store information on list of events
 * 
 * @author alexander.rogalskiy
 * @version 1.0
 * @since   2017-04-13
 *
 */
@Root(name="EventSearchRX")
public class EventEntityList {
	@Path("EventList")
	@ElementList(inline=true, name="EventList", required=true, entry="Event")
    private List<EventEntity> entities;

	public List<EventEntity> getEntities() {
		return entities;
	}

	public void setEntities(List<EventEntity> entities) {
		this.entities = entities;
	}
}
