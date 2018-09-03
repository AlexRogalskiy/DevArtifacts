import { Component, OnInit, OnDestroy, Inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EventsService } from '../events.service';
import { IEventEntity, IEventProductEntity, EventProductEntity } from '../event-card/event-entity.component';
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
	viewProviders: [ MdIconRegistry ],
	styles:
	[
		`
			.btn-grey{
				background-color:#D8D8D8;
				color:#FFF;
			}
			.rating-block{
				background-color:#FAFAFA;
				border:1px solid #EFEFEF;
				padding:15px 15px 20px 15px;
				border-radius:3px;
			}
			.bold{
				font-weight:700;
			}
			.padding-bottom-7{
				padding-bottom:7px;
			}

			.review-block{
				background-color:#FAFAFA;
				border:1px solid #EFEFEF;
				padding:15px;
				border-radius:3px;
				margin-bottom:15px;
			}
			.review-block-name{
				font-size:12px;
				margin:10px 0;
			}
			.review-block-date{
				font-size:12px;
			}
			.review-block-rate{
				font-size:13px;
				margin-bottom:15px;
			}
			.review-block-title{
				font-size:15px;
				font-weight:700;
				margin-bottom:10px;
			}
			.review-block-description{
				font-size:13px;
			}
			
			.rating-details {
				display: block;
				width: 205px;
				display: inline-block;
			}
			
			.rating-average {
				float: left;
				display: block;
				width: 250px;
			}
			
			.item-counter {
				min-width: 180px;
			}
			
			.pull-left.bar {
				width: 135px!important;
			}
			
			.rating {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		`
	]
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
	private eventRatingLabel: string 				= "Отзывы:";
	private eventAverageRatingLabel: string 		= "Средний рейтинг";
	private eventPositionRatingLabel: string 		= "Позиции рейтинга";
	
	private eventNameTableLabel: string 			= "Событие";
	private eventStartDateTableLabel: string 		= "Дата начала";
	private eventEndDateTableLabel: string 			= "Дата окончания";
	private eventTicketNumberTableLabel: string 	= "Количество";
	private eventPriceTableLabel: string 			= "Стоимость";
	
	private tariffs: Array<any> =
	[
		{type: 'Взрослый', 		scale: '80%', style: {'width': '80%'}},
		{type: 'Студенческий', 	scale: '70%', style: {'width': '70%'}},
		{type: 'Школьный', 		scale: '70%', style: {'width': '70%'}},
		{type: 'Детский', 		scale: '65%', style: {'width': '65%'}},
	];
	
	private scales: Array<any> = 
	[
		{price: 1000, 	style: {'meter': true, 'meter-left': true}},
		{price: 2000, 	style: {'meter': true, 'meter-left': true}},
		{price: 10000, 	style: {'meter': true, 'meter-right': true}},
		{price: 7000, 	style: {'meter': true, 'meter-right': true}}
	];
	
	private id: 			number = 0;
	//private items: 		Array<ITicketEntity> = [];
	private items: 			Observable<Array<ITicketEntity>> = null;
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
		this.items = this.ticketStore.getAllTickets();
	}
	
	private getEvent() : void {
		//this.eventsService.getEventByID(this.id)
		//		.then((eventItem: IEventEntity) => { this.eventEntity = eventItem; })
		//		.then(() => Observable.from(this.eventEntity.products).subscribe((value) => 
		//																this.ticketsEntity.push(new TicketEntity(value.id, value.eventId, value.name, 1, value.couponPrice, value.couponPrice, value.couponLimit))));
		//{code: '1', name: '1', value: 1}
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
				{ id: 1, eventId: 7, name: 'zxcv', contentUid: '', startTime: new Date() as Date, endTime: new Date() as Date, couponLimit: 10, couponPrice: 1, couponExist: 1 },
				{ id: 2, eventId: 7, name: 'asdf', contentUid: '', startTime: new Date() as Date, endTime: new Date() as Date, couponLimit: 10, couponPrice: 2, couponExist: 1 },
				{ id: 3, eventId: 7, name: 'qwer', contentUid: '', startTime: new Date() as Date, endTime: new Date() as Date, couponLimit: 10, couponPrice: 33, couponExist: 1 },
			]
		};
		//this.ticketsEntity.push(new TicketEntity(1, 7, '1', 1, 1, 1, new Date('21 May 1958 10:12'), new Date('22 May 1958 10:12'), 10, null, 'asdf')); //{code: '1', name: '1', value: 1}
		this.ticketsEntity.push(new TicketEntity('1', 1, 1, null, 'asdf', new EventProductEntity(1, 1, '1', '', new Date('21 May 1958 10:12'), new Date('22 May 1958 10:12'), 10, 1, 10)));
		//{code: '1', name: '1', value: 1}
		this.ticketsEntity.push(new TicketEntity('2', 1, 2, null, 'asdf', new EventProductEntity(2, 2, '2', '', new Date('21 May 1958 10:12'), new Date('22 May 1958 10:12'), 20, 2, 20)));
		this.ticketsEntity.push(new TicketEntity('3', 1, 33, null, 'asdf', new EventProductEntity(3, 3, '3', '', new Date('21 May 1958 10:12'), new Date('22 May 1958 10:12'), 30, 3, 30)));
		this.ticketsEntity.push(new TicketEntity('4', 1, 4, null, 'asdf', new EventProductEntity(4, 4, '4', '', new Date('21 May 1958 10:12'), new Date('22 May 1958 10:12'), 40, 4, 40)));
	}
	
	public addToCart(ticketId: number, eventName: string) : void {
		let ticket = this.getTicket(ticketId);
		if(!ticket) return;
		//if(null != ticket) {
		//	this._totalPrice 	+= ticket.totalPrice;
		//	this._totalAmount 	+= ticket.amount;
		//}
		//this.ticketsEntity = this.ticketsEntity.map((ticketEntity: ITicketEntity) => ticketEntity);
		ticket.eventName = eventName;
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
		this.ticketsEntity = this.ticketsEntity.map((ticketEntity: ITicketEntity) => (ticketEntity.eventInfo.id === id)
			?
			{
				eventInfo: ticketEntity.eventInfo,
				totalPrice: totalPrice,
				amount: ticketNumber,
				label: ticketEntity.label,
				discount: ticketEntity.discount,
				eventName: ticketEntity.eventName
			}
			: ticketEntity);
	}
	
	public getTotalPrice(ticketId: number) : number {
		let ticket = this.getTicket(ticketId);
		return (ticket && ticket.totalPrice) ? ticket.totalPrice : 0;
	}
	
	public getTotalAmount(ticketId: number) : number {
		let ticket = this.getTicket(ticketId);
		return (ticket && ticket.amount) ? ticket.amount : 0;
	}
	
	public getTicket(ticketId: number) : ITicketEntity {
		return (this.ticketsEntity.filter((ticketEntity: ITicketEntity) => (ticketEntity.eventInfo.id === ticketId))[0]);
	}
	
	public isTicketExist() : boolean {
		return !(null == this.eventEntity.products || 0 === this.eventEntity.products.length);
	}
}
