import { Component, Input, Output, Injectable, Inject, OnInit, EventEmitter } from '@angular/core';
import { IEventProductEntity } from '../events/event-card/event-entity.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';

export interface IUserInfo
{
    firstName: 	string;
    lastName: 	string;
}

export class UserInfo implements IUserInfo
{
    firstName: 	'Имя';
    lastName: 	'Фамилия';
}

export interface IDiscount
{
    code: 		string;
	name?:		string;
	value: 		number;
}

export interface ITicketEntity
{
	//id: 			number;
	//eventId:		number;
    //price: 			number;
	label: 			string;
    amount?: 		number;
	totalPrice?: 	number;
	//startTime?:		Date;
	//endTime?:		Date;
	discount?:		IDiscount;
	//limit?:			number;
	eventName?:		string;
	eventInfo:		IEventProductEntity;
}

export class TicketEntity implements ITicketEntity
{
	constructor(
//		public id: number,
//		public eventId: number,
		public label: string,
		public amount: number,
//		public price: number,
		public totalPrice: number,
//		public startTime: Date = null,
//		public endTime: Date = null,
		public discount: IDiscount = null,
//		public limit: number = null,
		public eventName: string = null,
		public eventInfo: IEventProductEntity = null
	) {}
}

export interface ITicketState
{
    tickets: 		Array<ITicketEntity>;
	userInfo?:		IUserInfo;
	//totalPrice: 	number;
	//totalAmount: 	number;
}

const defaultState =
{
    tickets: [],
	userInfo: new UserInfo(),
	//totalPrice: 0,
	//totalAmount: 0
};

//const ticketStorage = new BehaviorSubject<ITicketState>(defaultState);
@Injectable()
export class TicketStorage implements OnInit {
	//private discount: IDiscount = null;
	private static EMPTY_DISCOUNT_VALUE: number = 1;
	private discounts: Array<IDiscount> = 
	[
		{code: '1', name: '1', value: 0.9},
		{code: '2', name: '2', value: 0.8},
		{code: '3', name: '3', value: 0.7},
		{code: '4', name: '4', value: 0.6},
	];
	
	private token: string = '';
	private ticketStorage: BehaviorSubject<ITicketState> = null;
	//@SessionStorage() public profile:any = {};
	//@LocalStorage() public hiddenMenuItems:Array<boolean> = [];
	//@SessionStorage('boundValue') public boundValue: Object = {};
	//@Output() updateTicketStore: EventEmitter<Object> = new EventEmitter<Object>();
	
	constructor(@Inject('APP_CONFIG') private config, @Inject(SessionStorageService) private sessionStorageService) {
		let ticketState: ITicketState = { tickets: this.getAllTickets() };
		this.ticketStorage = new BehaviorSubject<ITicketState>(ticketState);
		//this.sessionStorageService.store('boundValue', 1);
	}
	
	public ngOnInit(): void {
		//this.sessionStorageService.observe('boundValue').subscribe((value) => console.log('new value', value));
		this.ticketStorage.distinctUntilChanged().subscribe((value) => console.log('asdfasdf' + value));
		//this.ticketStorage.asObservable().do(changes => console.log('new state', changes)); 
	}

    public setCartState(state: ITicketState) {
        this.ticketStorage.next(state);
		//this.saveItem(this.items);
    }

    private getCartState() : ITicketState {
        return this.ticketStorage.value;
    }

    public purgeCartState() : void {
        this.ticketStorage.next(defaultState);
		this.sessionStorageService.clear(this.config.storageKey);
    }
	
	public addItem(_ticketEntity: ITicketEntity) : void {
		let tickets: Array<ITicketEntity> = this.getAllTickets() || [];
		if(this.hasItem(_ticketEntity)) {
			tickets = tickets.map((ticketEntity: ITicketEntity) => (ticketEntity.eventInfo.id === _ticketEntity.eventInfo.id && ticketEntity.eventInfo.eventId === _ticketEntity.eventInfo.eventId)
					?
					{
						eventInfo: _ticketEntity.eventInfo,
						//id: _ticketEntity.id,
						//eventId: _ticketEntity.eventId,
						//price: _ticketEntity.price,
						amount: _ticketEntity.amount + ticketEntity.amount,
						totalPrice: _ticketEntity.totalPrice + ticketEntity.totalPrice,
						label: _ticketEntity.label,
						//startTime: _ticketEntity.startTime,
						//endTime: _ticketEntity.endTime,
						eventName: _ticketEntity.eventName,
						discount: _ticketEntity.discount
					}
					: ticketEntity);
		} else {
			tickets.push(_ticketEntity);
		}

		let ticketState: ITicketState = { tickets: tickets, userInfo: this.getUserInfo() };
		this.sessionStorageService.store(this.config.storageKey, JSON.stringify(ticketState));
		this.ticketStorage.next(ticketState);
		//this.updateTicketStore.emit({text: ticketState});
	}
	
	public updateItem(_ticketEntity: ITicketEntity) : void {
		let tickets = this.getAllTickets();
		tickets = tickets.map((ticketEntity: ITicketEntity) => (ticketEntity.eventInfo.id === _ticketEntity.eventInfo.id && ticketEntity.eventInfo.eventId === _ticketEntity.eventInfo.eventId)
				?
				  _ticketEntity
				: ticketEntity);

		let ticketState: ITicketState = { tickets: tickets, userInfo: this.getUserInfo() };
		this.sessionStorageService.store(this.config.storageKey, JSON.stringify(ticketState));
		this.ticketStorage.next(ticketState);
		//this.updateTicketStore.emit({text: ticketState});
	}
	
	public saveItems(tickets: Array<ITicketEntity>, userInfo: IUserInfo) : void {
		let ticketState: ITicketState = { tickets: tickets, userInfo: userInfo };
		this.sessionStorageService.store(this.config.storageKey, JSON.stringify(ticketState));
		this.ticketStorage.next(ticketState);
	}
	
	public hasItem(_ticketEntity: ITicketEntity) : boolean {
		//return this.getAllTickets().findIndex((ticketEntity: ITicketEntity) => ticketEntity === _ticketEntity);
		if(this.isTicketStoreEmpty()) return false;
		return (this.getAllTickets().filter((ticketEntity: ITicketEntity) => (ticketEntity.eventInfo.id === _ticketEntity.eventInfo.id && ticketEntity.eventInfo.eventId === _ticketEntity.eventInfo.eventId))[0])
				? true
				: false;
	}
	
	public deleteItem(_ticketEntity: ITicketEntity) : void {
		let tickets = this.getAllTickets().filter((ticketEntity : ITicketEntity) => { return !(ticketEntity.eventInfo.id === _ticketEntity.eventInfo.id && ticketEntity.eventInfo.eventId === _ticketEntity.eventInfo.eventId) });
		let ticketState: ITicketState = { tickets: tickets, userInfo: this.getUserInfo() };
		this.sessionStorageService.store(this.config.storageKey, JSON.stringify(ticketState));
		this.ticketStorage.next(ticketState);
		//this.updateTicketStore.emit({text: ticketState});
	}
	
	public clearItems() : void {
		//this.purgeCartState();
		this.ticketStorage.next(defaultState);
		this.sessionStorageService.clear(this.config.storageKey);
	}
	
	/*public getTotalPrice() : number {
		return this.getCartState().totalPrice;
	}
	
	public getTotalAmount() : number {
		return this.getCartState().totalAmount;
	}*/
	
	public isTicketStoreEmpty() : boolean {
		return (null == this.getAllTickets() || 0 === this.getAllTickets().length);
	}
	
	public getTickets() : Array<ITicketEntity> {
		//console.log(this.ticketStorage.value.tickets);
		return (this.getAllTickets()) ? [] : this.getAllTickets();
	}

	public getTotalPrice() : number {
		if(this.isTicketStoreEmpty()) return 0;
		let totalPrice = this.getAllTickets().reduce((totalSum, cartItem) =>
		{
            return totalSum += cartItem.totalPrice, totalSum;
        }, 0);
        return totalPrice;
	}
	
	public getTotalPriceWithDiscount() : number {
		if(this.isTicketStoreEmpty()) return 0;
		let totalPrice = this.getAllTickets().reduce((totalSum, cartItem) =>
		{
            return totalSum += cartItem.totalPrice * ((cartItem.discount) ? cartItem.discount.value : TicketStorage.EMPTY_DISCOUNT_VALUE), totalSum;
        }, 0);
		//this.getDiscount(cartItem.discount.value)
        return totalPrice;
	}
	
	public getTotalAmount() : number {
		if(this.isTicketStoreEmpty()) return 0;
		let totalAmount = this.getAllTickets().reduce((totalSum, cartItem) =>
		{
            return totalSum += cartItem.amount, totalSum;
        }, 0);
        return totalAmount;
	}
	
	private getDiscount(discountCode: string) : IDiscount {
		return this.discounts.filter((discount: IDiscount) => discount.code === discountCode)[0];
	}
	
	private getDiscountValue(discountCode: string) : number {
		let discount = this.getDiscount(discountCode);
		return (discount) ? discount.value : TicketStorage.EMPTY_DISCOUNT_VALUE;
	}
	//----------------------------------------------------------------
	/*public saveItem(ticketEntity: ITicketEntity, price: number) : void {
		//let item = {id: 1, price: price, amount: 1, value: 1, label: "1"};
		//this.getCartState().tickets.push(item);
		//this.ticketStorage(this.getCartState());
		
		this.sessionStorageService.store(ticketEntity.id, JSON.stringify(ticketEntity));
		//this.updateTicketStore.emit({text: ticket});
	}*/
	
	//public getItem(ticketId: number) : ITicketEntity {
	//	return this.sessionStorageService.retrieve(ticketId);
	//}
	
	//public removeItem(ticketId: ITicketEntity) : void {
	//	this.sessionStorageService.clear(ticketId);
	//	//this.updateTicketStore.emit({text: ticket});
	//}
	
	//public hasItem(ticketId: number) : boolean {
	//	return this.sessionStorageService.retrieve(ticketId).then(value => value ? true : false);
	//}
	
	private getStorageDate() : any {
		return JSON.parse(this.sessionStorageService.retrieve(this.config.storageKey));
	}
	
	public getAllTickets() : ITicketEntity[] {
		//let items: ITicketState = null;
		//for (var i = 0; i < sessionStorage.length; i++) {
		//	items.push(JSON.parse(window.sessionStorage.getItem(sessionStorage.key(i))));
		//}
		let storageData = this.getStorageDate();
		return storageData ? storageData.tickets : [];
	}
	
	public getUserInfo() : IUserInfo {
		//let items: ITicketState = null;
		//for (var i = 0; i < sessionStorage.length; i++) {
		//	items.push(JSON.parse(window.sessionStorage.getItem(sessionStorage.key(i))));
		//}
		let storageData = this.getStorageDate();
		return storageData ? storageData.userInfo : {};
	}
	
	/*public getClientToken() : string {
		if(null == this.token || 0 === this.token.length) {
			this.token = this.generateNewToken();
		}
		return this.token;
	}
	
	private generateNewToken() : string {
        let ttl: string = Math.random().toString(36).substring(7);
		return ttl;
        //let currentTime: number = (new Date()).getTime() + ttl;
        //this.sessionStorageService.store({ttl: currentTime, token});
    }*/
}