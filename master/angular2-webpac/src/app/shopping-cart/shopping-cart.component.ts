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
	<div class="container">
		<div class="row">
			<div>
				<table class="table table-hover">
					<thead>
					   <th>{{ eventLabel }}</th>
						<th>{{ dateStartLabel }}</th>
						<th>{{ dateEndLabel }}</th>
						<th>{{ ticketAmountLabel }}</th>
						<th>{{ ticketPriceLabel }}</th>
						<th></th>
					</thead>
					
					<tbody *ngIf="isTicketStorageEmpty()" class="container">
						<tr>
							<td colspan="6" class="empty-cart text-center">
								<h5>Корзина пуста</h5>
							</td>
						</tr>
					</tbody>
					
					<tbody *ngIf="!isTicketStorageEmpty()">
						<tr *ngFor="let item of items">					   
							<td class="col-sm-3 col-md-3">
								<span class="item-name">
									<div class="media">
										<div class="media-body">
											<h4 class="media-heading"><a href="#"><span>{{ item.label }}</span></a></h4>
											<h5 class="media-heading"> {{ ticketEventNameLabel }} <a href="#">{{ item.eventName }}</a></h5>
										</div>
									</div>
									<span class="text-success"><strong>{{ ticketInStockLabel }} {{ item.eventInfo.couponExist }}</strong></span>
								</span>
							</td>
							<td class="col-sm-2 col-md-2 text-center"><span class="item-starttime">{{ item.eventInfo.startTime | date:'dd/MM/yyyy hh:mm'}}</span></td>
							<td class="col-sm-2 col-md-2 text-center"><span class="item-endtime">{{ item.eventInfo.endTime | date:'dd/MM/yyyy hh:mm'}}</span></td>
								
							<td class="col-sm-3 col-md-3 item-counter" style="text-align: center">
								<span class="item-counter">
									<counter [counterValue]="1" [counterRangeMax]="item.eventInfo.couponLimit" [counterRangeMin]="1" [(ngModel)]="item.amount" (change)="updateItem(item, $event.text)" (update)="updateItem(item, $event.text)" class="counter"></counter>
								</span>
							</td>
								
							<td class="col-sm-3 col-md-3 text-right">
								<span class="item-price">{{ item.totalPrice | currency:'RUB':true:'1.2-2' }}</span>
							</td>

							<td class="col-sm-1 col-md-1 text-right">
								<span class="item-button"><button md-button (click)="removeFromCart(item)" class="btn"><md-icon svgIcon="shopping-cart-remove" aria-hidden="true"></md-icon></button></span>
							</td>
						</tr>
						<tr>
							<td colspan="4" class="subPriceLabel"><h5>{{ ticketSubPriceLabel }}</h5></td>
							<td colspan="2" class="subPrice text-right"><h5><strong>{{ this.ticketStore.getTotalPrice() | currency:'RUB':true:'1.2-2' }}</strong></h5></td>
						</tr>
						<tr>
							<td colspan="4" class="subPriceLabel"><h5>{{ ticketDiscountPriceLabel }}</h5></td>
							<td colspan="2" class="subPrice text-right"><h5><strong>{{ this.ticketStore.getTotalPriceWithDiscount() | currency:'RUB':true:'1.2-2' }}</strong></h5></td>
						</tr>
						<tr>
							<td colspan="4" class="subPriceLabel"><h4>{{ ticketTotalPriceLabel }}</h4></td>
							<td colspan="2" class="subPrice text-right"><h4><strong>{{ this.ticketStore.getTotalPriceWithDiscount() | currency:'RUB':true:'1.2-2' }}</strong></h4></td>
						</tr>
					</tbody>
				</table>
			</div>
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
	//public items: Array<ITicketEntity> 		= [];
	public ticketInStockLabel: string 			= "В наличии: ";
	public ticketSubPriceLabel: string 			= "Подитог: ";
	public ticketDiscountPriceLabel: string		= "Цена с учетом скидки: ";
	public ticketTotalPriceLabel: string 		= "Итого: ";
	public ticketEventNameLabel: string 		= "Мероприятие:";
		
	public eventLabel: string 					= "Событие";
	public dateStartLabel: string 				= "Дата начала";
	public dateEndLabel: string 				= "Дата окончания";
	public ticketAmountLabel: string 			= "Количество";
	public ticketPriceLabel: string 			= "Стоимость";
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
		if(isNaN(+value) || !Number.isInteger(+value)) return;
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
		ticketEntity.totalPrice = ticketEntity.eventInfo.couponPrice * value;
		//this.items = this.items.map(m => (m.id === ticketEntity.id) ? { id: ticketEntity.id, eventId: ticketEntity.eventId, label: ticketEntity.label, price: ticketEntity.price, amount: ticketEntity.amount, totalPrice: ticketEntity.totalPrice } : m);
		this.ticketStore.updateItem(ticketEntity);
		//console.log(this.ticketStore.getTickets());
	}
	
	public getItems() : Array<ITicketEntity> {
		return this.ticketStore.getAllTickets();
	}
	
	public isTicketStorageEmpty() : boolean {
		return this.ticketStore.isTicketStoreEmpty();
	}
}
