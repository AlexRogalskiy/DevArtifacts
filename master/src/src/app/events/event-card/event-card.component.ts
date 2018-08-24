/**
 * Created by pavel.antoshenko on 1/27/2017.
 */
import {Component, Input, ViewEncapsulation} from "@angular/core";
import {EventEntity} from "./event-entity.component";

@Component({
	selector: 'event-card',
	templateUrl: 'event-card.html',
	encapsulation: ViewEncapsulation.None
})
export class EventCard {
	@Input('event') event: EventEntity;
	
	//Tag Attributes
	@Input() id: number;
	@Input() name: string;
    @Input() visible: boolean = true;
	@Input() selected: boolean;

	constructor(_event: EventEntity) {
		this.event = _event;
	}
	
	public setEventEntity(event: EventEntity) {
		this.event = event;
	}
	
	public getEventEntity() {
		return this.event;
	}
	
	public mouseEnter(div: string){
		console.log("mouse enter : " + div);
	}

	public mouseLeave(div: string){
		console.log('mouse leave :' + div);
	}
	
	public getSubTitle() {
		return this.event.getSubTitle();
	}
	
	public getTitle() {
		return this.event.getTitle();
	}
	
	/*public flipCard() {
	  var cards = document.querySelectorAll(".card.effect__click");
		  for ( var i  = 0, len = cards.length; i < len; i++ ) {
			var card = cards[i];
			clickListener( card );
		  }

		  function clickListener(card) {
			card.addEventListener( "click", function() {
			  var c = this.classList;
			  c.contains("flipped") === true ? c.remove("flipped") : c.add("flipped");
			});
		  }
	}*/
}
