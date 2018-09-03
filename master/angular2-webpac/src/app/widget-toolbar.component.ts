/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import { Component, ViewEncapsulation, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { ITicketEntity } from './shopping-cart/ticket-storage.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	selector: 'widget-toolbar',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./events/events.css'],
	template:
	`
		<md-toolbar color="primary">
			<menu-bar (update)="onUpdate($event.text)"></menu-bar>
			<event-search (change)="searchTerm($event.text)" *ngIf="this.searchView"></event-search>
			<button md-button (click)="openShoppingCart()"><md-icon svgIcon="shopping-cart" aria-hidden="true"></md-icon>&nbsp;&nbsp;{{ shoppingCartLabel }} [{{ this.totalAmount | number }}] ({{ totalPrice | currency:'RUB':true:'1.2-2' }})</button>
		</md-toolbar>
		<shopping-cart-dialog #shoppingCartDialog [items]="items"></shopping-cart-dialog>
	`,
	viewProviders: [ MdIconRegistry ]
})

export class WidgetToolbar implements OnInit {
	@ViewChild("shoppingCartDialog") modal: ModalComponent;
	@Input('seachView') searchView: boolean = false;
	@Input('totalPrice') totalPrice: number = 0;
	@Input('totalAmount') totalAmount: number = 0;
	@Input('items') items: Array<ITicketEntity> = [];
	
	private shoppingCartLabel: string = 'Корзина';
	private shoppingCartAmount: BehaviorSubject<number> = null;
	
	@Output() updateSearch: EventEmitter<Object> 	= new EventEmitter<Object>();
	@Output() updateStyle: EventEmitter<Object> 	= new EventEmitter<Object>();
	
	constructor(private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
		this.mdIconRegistry.addSvgIcon('shopping-cart', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/shopping-cart.svg'));
		this.shoppingCartAmount = new BehaviorSubject<number>(this.totalAmount);
	}
	
	public ngOnInit() : void {
		this.shoppingCartAmount.subscribe((value: number) => console.log(value));
	}
	
	private searchTerm(event) : void {
		if(null == event) return;
		this.updateSearch.emit({text: event});
		//this.shoppingCartAmount.next(++this.totalAmount);
	}
	
	public onUpdate(event) : void {
		this.updateStyle.emit({text: event});
	}
	
	public openShoppingCart() : void {
		this.modal.open();
	}
}
