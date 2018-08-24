import { Component, OnInit, OnDestroy, Inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EventsService } from '../events.service';
import { IEventEntity, IEventProductEntity } from '../event-card/event-entity.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ITicketEntity, TicketEntity, TicketStorage } from '../../shopping-cart/ticket-storage.component';
//EventProductEntity
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
//import {ErrorHandler} from '../../error-handler.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';

/**
 * Created by pavel.antoshenko on 1/30/2017.
 */
@Component(
{
	selector: 'event',
	//providers: [EventsService],//ErrorHandler
	// styleUrls: ['./events.css'],
	templateUrl: './event.html',
	viewProviders: [ MdIconRegistry ]
})

export class Event implements OnInit, OnDestroy {
	private eventUpdatedLabel: string 				= "Обновлено:";
	private eventNameLabel: string 					= "Мероприятие:";
	private eventStartDateLabel: string 			= "Дата начала:";
	private eventEndDateLabel: string 				= "Дата окончания:";
	private eventPhoneLabel: string 				= "111-222-3333";
	private eventEmailLabel: string 				= "kassir@example.com";
	
	private eventAboutLabel: string 				= "Информация о мероприятии:";
	private eventOrgLabel: string 					= "Данные об организаторе:";
	private eventServicesLabel: string 				= "Ключевые события:";
	private eventTariffLabel: string 				= "Тарифы:";
	
	private eventNameTableLabel: string 			= "Событие";
	private eventStartDateTableLabel: string 		= "Дата начала";
	private eventEndDateTableLabel: string 			= "Дата окончания";
	private eventTicketNumberTableLabel: string 	= "Количество";
	private eventPriceTableLabel: string 			= "Стоимость";
	
	private id: 			number = 0;
	//private items: 		Array<ITicketEntity> = [];
	private items: 			Observable<Array<ITicketEntity>>;
	private ticketsEntity: 	Array<ITicketEntity> = [];
	public tickets: 		BehaviorSubject<Array<ITicketEntity>> = null;
	
	private eventEntity: 	IEventEntity = null;
	private addToCartLabel: string = "Добавить";
	private subscriber: 	any;
	private localState: 	any;
	
	//@Output() updateShoppingCart: EventEmitter<Object> = new EventEmitter<Object>();
	public isSearchView: boolean 	= false;
	public _totalPrice: number 		= 0;
	public _totalAmount: number 	= 0;
	
	constructor(@Inject(EventsService) private eventsService, @Inject(TicketStorage) private ticketStore, private route: ActivatedRoute, private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
		this.mdIconRegistry.addSvgIcon('up-arrow', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/up-arrow.svg'));
		this.mdIconRegistry.addSvgIcon('shopping-cart-add', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/shopping-cart-add.svg'));
		this.tickets = new BehaviorSubject<Array<ITicketEntity>>(this.ticketsEntity);
	}

	public ngOnInit() : void {
		this.subscriber = this.route.params.subscribe((params : Params) =>
		{
			if (params['id']) {
				this.id 		= +params['id'];
				this.localState = +params['id'];
			}
			this.getEvent();
		});
		//this._totalAmount = this.ticketStore.getTotalAmount();
		//this._totalPrice = this.ticketStore.getTotalPrice();
		//this.items = this.//Observable.interval(500).map(i => this.items = this.ticketStore.getAllTickets());//.take(this.ticketStore.getAllTickets().length);
	}
	
	private getEvent() : void {
		//this.eventsService.getEventByID(this.id)
		//		.then((eventItem: IEventEntity) => { this.eventEntity = eventItem; })
		//		.then(() => Observable.from(this.eventEntity.products).subscribe((value) => 
		//																this.ticketsEntity.push(new TicketEntity(value.id, value.eventId, value.name, 1, value.couponPrice, value.couponPrice))));
		this.eventEntity =
		{
			id: 7,
			eventId: 7,
			name: 'asdf',
			contentUid: 'asdf',
			startTime: new Date() as Date,
			endTime: new Date() as Date,
			products:
			[
				{id: 1, eventId: 7, name: 'zxcv', contentUid: '', startTime: new Date() as Date, endTime: new Date() as Date, couponLimit: 0, couponPrice: 1, couponExist: 0},
				{id: 2, eventId: 7, name: 'asdf', contentUid: '', startTime: new Date() as Date, endTime: new Date() as Date, couponLimit: 0, couponPrice: 2, couponExist: 0},
				{id: 3, eventId: 7, name: 'qwer', contentUid: '', startTime: new Date() as Date, endTime: new Date() as Date, couponLimit: 0, couponPrice: 2, couponExist: 0}
			]
		};
		this.ticketsEntity.push(new TicketEntity(1, 7, '1', 1, 1, 1));
		this.ticketsEntity.push(new TicketEntity(2, 7, '2', 1, 2, 2));
		this.ticketsEntity.push(new TicketEntity(3, 7, '3', 1, 3, 3));
		this.ticketsEntity.push(new TicketEntity(4, 7, '4', 1, 4, 4));
	}
	
	public addToCart(id: number) : void {
		let ticket = this.getTicket(id);
		//if(null != ticket) {
		//	this._totalPrice 	+= ticket.totalPrice;
		//	this._totalAmount 	+= ticket.amount;
		//}
		//this.ticketsEntity = this.ticketsEntity.map((ticketEntity: ITicketEntity) => ticketEntity);
		this.ticketStore.addItem(ticket);
		
		//this._totalAmount = this.ticketStore.getTotalAmount();
		//this._totalPrice = this.ticketStore.getTotalPrice();
		
		this.items = this.ticketStore.getAllTickets();
		//this.tickets.next(this.ticketsEntity);
		//this.ticketStore.addItem(eventProductEntity.eventId, this.ticketsEntity);
	}
	
	public onUpdate(eventProductEntity: IEventProductEntity, ticketNumber: number) : void {
		if(isNaN(+ticketNumber) || !Number.isInteger(+ticketNumber)) return;
		this.update(eventProductEntity.id, ticketNumber, eventProductEntity.couponPrice * ticketNumber);
		this.tickets.next(this.ticketsEntity);
		//this.ticketStore.addItem(eventProductEntity.eventId, this.ticketsEntity);
		//this.updateShoppingCart.emit({text: '1'});
	}
	
	public ngOnDestroy() : void {
		this.subscriber.unsubscribe();
	}

	private update(id: number, ticketNumber: number, totalPrice: number) : void {
		this.ticketsEntity = this.ticketsEntity.map((ticketEntity: ITicketEntity) => (ticketEntity.id === id) ? { id: ticketEntity.id, eventId: ticketEntity.eventId, totalPrice: totalPrice, price: ticketEntity.price, amount: ticketNumber, label: ticketEntity.label } : ticketEntity);
	}
	
	public getTotalPrice(ticketId: number) : number {
		let totalPrice = this.getTicket(ticketId).totalPrice;
		return (totalPrice) ? totalPrice : 0;
	}
	
	public getTicket(ticketId: number) : ITicketEntity {
		return this.ticketsEntity.filter((ticketEntity: ITicketEntity) => (ticketEntity.id === ticketId))[0];
	}
}
