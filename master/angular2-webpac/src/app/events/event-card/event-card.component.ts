/**
 * Created by pavel.antoshenko on 1/27/2017.
 */
import { Component, Input, ViewEncapsulation, Inject, OnInit } from "@angular/core";
import { EventEntity, ITicketBundle, TicketBundle } from "./event-entity.component";
import { ShoppingCartService } from "../../shopping-cart/shopping-cart.service";

@Component({
	selector: 'event-card',
	templateUrl: 'event-card.html',
	encapsulation: ViewEncapsulation.None,
	styles:
	[
		`
			.no-tickets-event { position: absolute; right: -5px; }
			.btn-glyphicon { padding:8px; background:#ffffff; margin-right:4px; }
			.icon-btn { padding: 1px 15px 3px 2px; border-radius:50px;}
		`
	]
})
export class EventCard implements OnInit {
	private ticketBundle: ITicketBundle = null;
	// Event Tag
	@Input('event') event: EventEntity;
	//Tag Attributes
	@Input() id: number;
	@Input() name: string;
    @Input() visible: boolean = true;
	@Input() selected: boolean = false;

	constructor(@Inject(ShoppingCartService) private ticketsService) {}
	
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
	
	public ngOnInit() : void {
		this.getTicketBundle();
	}
	
	private getTicketBundle() : void {
		this.ticketBundle  = new TicketBundle(4, 7, 250, 1100, 0);
		//this.ticketsService.getAvailableTickets(event.id).then((_ticketBundle: ITicketBundle) => this.ticketBundle = _ticketBundle);
	}
}
