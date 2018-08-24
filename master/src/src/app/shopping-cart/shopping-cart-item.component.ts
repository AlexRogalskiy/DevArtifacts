import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { TicketStorage } from './card_back';


@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'shopping-cart-item',
	template:
	`	<tr>
			<td><span>{{ item }}</span></td>
			<td>2{{ item.startTime | date:'dd/MM/yyyy hh:mm'}}</td>
			<td>3{{ item.endTime | date:'dd/MM/yyyy hh:mm'}}</td>
			<td><counter [counterValue]="1" [counterRangeMax]="9999" [counterRangeMin]="1" [(ngModel)]="item" (change)="this.update.emit({text: item})" (update)="this.update.emit({text: item})" class="counter"></counter></td>
			<td><span class="item-price">4{{ item.price | currency:'RUB':true:'4.2-2' }}</span></td>
		</tr>
	`,
	styles: []
})

export class ShoppingCartItem implements OnInit {
	@Input('item') item : String;
	@Input('label') label : String;
	@Output() update: EventEmitter<Object> = new EventEmitter<Object>();
	private isMousedown: boolean = false;
 
	public onClick(event, value) : void {
		console.log(event);
		console.log(value);
	}

	constructor() {
		//setInterval(()=> this.item = Math.random().toString(), 1000);
	}
	
	public ngOnInit() : void { }
}
