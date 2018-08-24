import { Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { TicketStorage, ITicketEntity } from './ticket-storage.component';
//import {ShoppingCartService } from './shopping-cart.service';

import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

// Component decorator
@Component({
    selector: 'shopping-cart',
    template:
	`
	<div>
		<div class="shopping-cart-form" novalidate>
			<table class="table table-striped table-responsive item-data-table">
				<thead>
					<tr>
						<th>{{ eventLabel }}</th>
						<th>{{ dateStartLabel }}</th>
						<th>{{ dateEndLabel }}</th>
						<th>{{ ticketAmountLabel }}</th>
						<th>{{ ticketPriceLabel }}</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<!--<shopping-cart-item *ngFor="let item of items" [(item)]="item.value" (update)="updateItem(item, $event.text)" label="{{ item.label }}"></shopping-cart-item>-->
					<tr *ngFor="let item of items">
						<td><span>{{ item.label }}</span></td>
						<td>2{{ item.startTime | date:'dd/MM/yyyy hh:mm'}}</td>
						<td>3{{ item.endTime | date:'dd/MM/yyyy hh:mm'}}</td>
						<td><counter [counterValue]="1" [counterRangeMax]="9999" [counterRangeMin]="1" [(ngModel)]="item.amount" (change)="updateItem(item, $event.text)" (update)="updateItem(item, $event.text)" class="counter"></counter></td>
						<td><span class="item-price">{{ item.totalPrice | currency:'RUB':true:'1.2-2' }}</span></td>
						<td><button md-button (click)="removeFromCart(item)"><md-icon svgIcon="shopping-cart-remove" aria-hidden="true"></md-icon></button></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	`,
	viewProviders: [ MdIconRegistry ],
	encapsulation: ViewEncapsulation.None
})
// Component class
export class ShoppingCart implements OnInit {
	//public items: Array<ITicketEntity> = [{id: 1, value: 1, label: 'Событие № 1', price: 1, amount: 1}, {id: 2, value: 2, label: 'Событие № 2', price: 2, amount: 2}, {id: 3, value: 3, label: 'Событие № 3', price: 3, amount: 3}];
	@Input('items') items: Array<ITicketEntity> = [];
	//public items: Array<ITicketEntity> 	= [];
	public eventLabel: string 			= "Событие";
	public dateStartLabel: string 		= "Дата начала";
	public dateEndLabel: string 		= "Дата окончания";
	public ticketAmountLabel: string 	= "Количество";
	public ticketPriceLabel: string 	= "Стоимость";
	//@Output() update: EventEmitter<Object> = new EventEmitter<Object>();
	
    // Constructor
    constructor(@Inject(TicketStorage) private ticketStore, private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
		this.mdIconRegistry.addSvgIcon('shopping-cart-remove', this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/icon/shopping-cart-remove.svg'));
	}

	//public shoppingCartForm: FormGroup;
    //Define input properties
	//@Input() listId: string;
    //@Input() editId:string;
	//@Input() comment:string;

    private editTicket() : void {
        // Emit edit ticket
        //EmitterService.get(this.editId).emit(this.comment);
    }

    private deleteTicket(id: string) : void {
        // Call removeComment() from CommentService to delete comment
        /*this.ticketService.removeComment(id).subscribe(
			data => { 
				EmitterService.get(this.listId).emit(data);
			},
            err => {
                console.log(err);
            });
		*/
    }
	
	public updateItem(ticketEntity: ITicketEntity, value: number) : void {
		//this.ticketStore.update(ticketEntity, value);
		this.update(ticketEntity, +value);
		//this.shoppingCartService.update(item, value);
		//this.items = this.shoppingCartService.getItems();
	}
	
	public ngOnInit(): void {
		this.items = this.ticketStore.getAllTickets();
		//this.items = this.shoppingCartService.getItems();
		/*this.shoppingCartForm = new FormGroup({
			cartItemCounter: new FormControl(this.counterValue,
												[
													createCounterRangeValidator(this.counterMax, this.counterMin),
													<any>Validators.required,
													<any>Validators.minLength(1),
													<any>Validators.maxLength(4),
													<any>Validators.pattern(/^[0-9]+$/),
													CustomValidators.digits,
													CustomValidators.min(this.counterMin),
													CustomValidators.max(this.counterMax)
												])
		});*/
		//console.log(this.ticketStore.getTickets());
	}
	
	public removeFromCart(ticketEntity: ITicketEntity) : void {
		this.ticketStore.deleteItem(ticketEntity);
		this.items = this.ticketStore.getAllTickets();
	}
	
	private update(ticketEntity: ITicketEntity, value: number) : void {
		ticketEntity.amount = value;
		ticketEntity.totalPrice = ticketEntity.price * value;
		//this.items = this.items.map(m => (m.id === ticketEntity.id) ? { id: ticketEntity.id, eventId: ticketEntity.eventId, label: ticketEntity.label, price: ticketEntity.price, amount: ticketEntity.amount, totalPrice: ticketEntity.totalPrice } : m);
		this.ticketStore.updateItem(ticketEntity);
		//console.log(this.ticketStore.getTickets());
	}
	
	public getItems() : Array<ITicketEntity> {
		return this.ticketStore.getTickets();
	}
}
