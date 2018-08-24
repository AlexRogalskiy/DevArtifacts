/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import {Component, ElementRef, ViewEncapsulation, ViewChild, ViewChildren, ContentChild, Input, Output, QueryList, EventEmitter, ContentChildren, OnInit, AfterContentInit, AfterViewInit, Inject} from '@angular/core';
import {EventsService} from "./events.service";
//import {PageScrollInstance, PageScrollService, PageScrollConfig} from 'ng2-page-scroll';
import {IEventEntity} from "./event-card/event-entity.component";
//import {DOCUMENT} from '@angular/platform-browser';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';

//import {DialogComponent} from '../shopping-cart/dialog.component';
//import {DialogAnchorDirective} from '../shopping-cart/dialoganchor.directive';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	selector: 'events',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./events.css'],
	template:
	`
		<widget-toolbar (updateSearch)="onUpdateSearch($event.text)" (updateStyle)="isDarkTheme=!isDarkTheme" [seachView]="isSearchView"></widget-toolbar>
		
		<md-sidenav-layout [class.defaultLayoutThemeView]="isDarkTheme">
			<div class="app-content" infinite-scroll [infiniteScrollDistance]="scrollDistance" [infiniteScrollThrottle]="scrollThrottle" (scrolled)="onScrollDown()">
				<event-card *ngFor="let event of events" [event]="event"></event-card>
			</div>
		</md-sidenav-layout>

		<shopping-cart-dialog #shoppingCartDialog></shopping-cart-dialog>

		<scroll-button></scroll-button>
	`,
	viewProviders: [ MdIconRegistry ]
})

export class Events implements OnInit {
	@ViewChild("shoppingCartDialog") modal: ModalComponent;
	public isSearchView: boolean = true;
	
	private events: Array<IEventEntity> 		= [];
	private eventsView: Array<IEventEntity> 	= [];
	
	private scrollThrottle: number = 300;
	private scrollDistance: number = 2;
	
	private itemsPerView: number = 10;
	private itemsPerPage: number = 10;
	
	//@ViewChild(EventEntity) eventViewChild: EventEntity;
	//@ViewChildren(EventEntity) eventViewChildren: QueryList<EventEntity>;
	//@ContentChild(EventEntity) eventContentChild: EventEntity;

	constructor(@Inject(EventsService) private eventsService, private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
		//console.log('new - eventViewChild is ' + this.eventViewChild);
		this.mdIconRegistry.addSvgIcon('up-arrow', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/up-arrow.svg'));
	}
	
	public ngAfterContentInit() {
		//console.log('ngAfterContentInit - eventContentChild is ' + this.eventContentChild);
		//console.log(this.events);
	}
  
	public ngAfterViewInit() {
		//console.log('ngAfterViewInit - eventViewChildren is ' + this.eventViewChildren);
		//this.events = this.eventViewChildren.toArray();
		//console.log(this.events);
	}
	
	public ngOnInit() {
		this.getEventsList();
		//this.addItems(0, this.itemsPerView);
	}
	
	public addEvent(_event: IEventEntity) : void {
		this.events.push(_event);
		//this.events[_event.id] = _event;
	}
	
	public removeEvent(_event: IEventEntity) : void {
		if(null == _event) return;
		
		for(var i=0, len=this.size(); i<len; i++) {
			if(_event === this.events[i]) {
				this.events.splice(i, 1);
				//this.events[i] = null;
			}
		}
	}
	
	public setEvent(_event: IEventEntity, index: number) : void {
		if(index < 0) {
			return null;
		}
		this.events[index] = _event;
	}
	
	public getEventByID(index: number) : IEventEntity {
		if(index < 0 || index >= this.size()) {
			return null;
		}
		return this.events[index];
	}
	
	public getAllEvents() : IEventEntity[] {
		return (this.events);
	}
	
	private addItems(startIndex, endIndex) : void {
		let temp = this.events.slice(startIndex, endIndex);
		for (let i = 0; i < temp.length; ++i) {
			this.eventsView.push(temp[i]);
		}
	}
	
	public isEmptyList() : boolean {
		return (0 == this.size());
	}
	
	private size() : number {
		return (this.events.length);
		/*var size = 0, key;
		for (key in this.events) {
			if (this.events.hasOwnProperty(key)) size++;
		}
		return size;*/
	}
	
	public onSelect(_event: IEventEntity) : void {
        console.log('card: ' + _event.id + ' : ' + _event.name);
    }
	
	private getEventsList() : void {
		this.eventsService.getEvents().then((eventItem: Array<IEventEntity>) => this.events = eventItem);
    }
	
	private onScrollDown() : void {
		const initialItems = this.itemsPerPage;
		this.itemsPerPage += this.itemsPerView;
		//this.addItems(initialItems, this.itemsPerPage);
	}
	
	private searchTerm(event) : void {
		if(null == event) return;
		this.events = event;
	}
	
	public onUpdate(event) : void {
		console.log('onUpdate');
	}
	
	public onUpdateSearch(event) : void {
		this.events = event;
	}
	
	public onUpdateStyle(event) : void {
		console.log('onUpdateStyle');
	}
}
