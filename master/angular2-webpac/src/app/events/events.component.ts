/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import { Component, ElementRef, ViewEncapsulation, ViewChild, ViewChildren, ContentChild, Input, Output, QueryList, EventEmitter, ContentChildren, OnInit, AfterContentInit, AfterViewInit, Inject, HostBinding, trigger, state, style, transition, animate } from '@angular/core';
import { EventsService } from "./events.service";
import { IEventEntity, EventEntity } from "./event-card/event-entity.component";
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

//import {DialogComponent} from '../shopping-cart/dialog.component';
//import {DialogAnchorDirective} from '../shopping-cart/dialoganchor.directive';

import { TicketStorage } from '../shopping-cart/ticket-storage.component';
import { DatePicker } from './datepicker/datepicker.component';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	selector: 'events',
	encapsulation: ViewEncapsulation.None,
	//styleUrls: ['./nouislider.css'],
	template:
	`
		<widget-toolbar (updateStyle)="isDarkTheme=!isDarkTheme" [seachView]="isSearchView" [totalAmount]="this.ticketStore.getTotalAmount()" [totalPrice]="this.ticketStore.getTotalPrice()"></widget-toolbar>
		
		<md-sidenav-layout class="right-navigation">
		
			<md-sidenav #start mode="side" [opened]="isSideBarOpened" (mouseenter)="onMouseEnter(start)" (mouseleave)="onMouseLeave(start)" [@slideInOut]="menuState" class="sidebar-menu">
				
				<div class="col-md-10 rightside" id="rightside">
					<md-nav-list>
						<div class="row"><h4>Фильтр по дате:</h4></div>
						<md-list-item>
							<datepicker [model]="datePickerModel" [type]="type" [placeholder]="datePickerStartPlaceholder" [format]="datePickerFormat" [disabled]="false"></datepicker>
						</md-list-item>
						<md-list-item>
							<datepicker [model]="datePickerModel" [type]="type" [placeholder]="datePickerEndPlaceholder" [format]="datePickerFormat" [disabled]="false"></datepicker>
						</md-list-item>
						
						<md-divider></md-divider>
						
						<div class="row"><h4>Фильтр по цене:</h4></div>
						<md-list-item>
							<nouislider [config]="sliderConfig" [(ngModel)]="sliderModel" class="price-range" [tooltips]="[ true, true ]" (ngModelChange)="onSliderChange($event)"></nouislider>
						</md-list-item>
					</md-nav-list>
				</div>
				
				<div class="col-md-2 leftside" id="leftside">
					<md-icon svgIcon="menu" class="menu"></md-icon>
				</div>
				
			</md-sidenav>
			
			<md-sidenav-layout [class.defaultLayoutThemeView]="isDarkTheme" class="right-navigation">
				<div class="app-content" infinite-scroll [infiniteScrollDistance]="scrollDistance" [infiniteScrollThrottle]="scrollThrottle" (scrolled)="onScrollDown()">
					<event-card *ngFor="let event of events; trackBy: trackByEvents" [event]="event"></event-card>
				</div>
			</md-sidenav-layout>
			
		</md-sidenav-layout>
		
		<!-- <material-datepicker altInputStyle="true" dateFormat="dd-mm-yyyy" [(date)]="date" (onSelect)="onSelectDate($event)" (dateChange)="onChangeDate($event)" placeholder="{{ datePlaceHolder }}"></material-datepicker> -->
		<shopping-cart-dialog #shoppingCartDialog></shopping-cart-dialog>
		<scroll-button></scroll-button>
	`,
	viewProviders: [ MdIconRegistry ],
	styles:
	[
		`
			.sidebar-menu {
				background: deepskyblue;
				color: #fff;
				position: fixed;
				//left: auto;
				top: 0;
				//right: 54px;
				
				right: 'auto',
				left: '54px',
				
				bottom: 0;
				width: auto;
				min-width: 400px;
				font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
				box-shadow: none!important;
			}
			
			md-sidenav.md-sidenav-side {
				padding-top: 65px;
			}
			
			md-list, md-nav-list {
				padding-top: 0px!important;
			}
			
			md2-datepicker {
				color: #000;
				max-width: 100%!important;
			}
			
			datepicker {
				width: 100%;
			}
			
			.md2-datepicker-placeholder {
				color: #fff!important;
				right: 0!important;
			}
			
			.md2-datepicker-input-container {
				padding: 18px 0 18px 40px!important;
			}
			
			.md-nav-list md-list-item .md-list-item {
				padding: 0 0px!important;
				height: auto!important;
				display: flex;
				flex-direction: column;
			}
			
			.md-sidenav-content {
				margin: 0px!important;
			}
			
			.leftside {
				height: 100%;
				display: inline-block;
				background-color: #2184cd;
				padding-top: 15px;
				width: auto!important;
			}
			
			.rightside {
				width: 100%;
				margin: 0 10px;
			}
			
			.rightside .row {
				padding: 10px 15px 25px 15px;
			}
			
			.leftside .menu {
				margin-left: auto;
				margin-right: auto;
				display: block;
			}
			
			.cdk-focus-trap-content {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
			}
			
			.price-range {
				width: 100%;
			}
			
			.md2.md-divider {
				margin: 10px 0px;
			}
		`
	],
	animations:
	[
		trigger('slideInOut',
		[
			state('in', style({
				transform: 'translate3d(0, 0, 0)',
				//right: '0px',
				//left: 'auto',
				right: 'auto',
				left: '0px',
			})),
			state('out', style({
				transform: 'translate3d(-100%, 0, 0)',
				//right: '54px',
				//left: 'auto',
				right: 'auto',
				left: '54px',
			})),
			transition('in => out', animate('400ms ease-in-out')),
			transition('out => in', animate('400ms ease-in-out')),
			transition('void => out',
			[
				style({
					transform: 'translate3d(100%, 0, 0)',
					//right: '54px',
					//left: 'auto',
					right: 'auto',
					left: '54px',
				}),
			]),
			transition('out => void',
			[
				style({
					transform: 'translate3d(100%, 0, 0)',
					//right: '54px',
					//left: 'auto',
					right: 'auto',
					left: '54px',
				}),
			]),
			transition('void => in',
			[
				style({
					transform: 'translate3d(100%, 0, 0)',
					right: 'auto',
					left: '54px',
					//right: '54px',
					//left: 'auto',
				}),
			]),
			transition('in => void',
			[
				style({
					transform: 'translate3d(100%, 0, 0)',
					right: 'auto',
					left: '54px',
					//right: '54px',
					//left: 'auto',
				}),
			]),
		]),
	],
})

export class Events implements OnInit {
	@ViewChild("shoppingCartDialog") modal: ModalComponent;
	@HostBinding('attr.type') type = 'datetime'; 
	
	private datePickerModel: any = new Date();
	private datePickerStartPlaceholder: string = "Дата/время начала события";
	private datePickerEndPlaceholder: string = "Дата/время окончания события";
	private datePickerFormat: string = "DD/MM/YYYY HH:mm";
	
	private isSearchView: boolean = true;
	private isSideBarOpened: boolean = true;
	
	//private datePlaceHolder: string = "Введите дату";
	//private date: Date = new Date();
	
	private events: Array<IEventEntity> 		= [];
	private eventsView: Array<IEventEntity> 	= [];
	
	private scrollThrottle: number = 300;
	private scrollDistance: number = 2;
	
	private itemsPerView: number = 10;
	private itemsPerPage: number = 10;
	
	private menuState: string = 'out';
	
	//@ViewChild(EventEntity) eventViewChild: EventEntity;
	//@ViewChildren(EventEntity) eventViewChildren: QueryList<EventEntity>;
	//@ContentChild(EventEntity) eventContentChild: EventEntity;

	constructor(@Inject(EventsService) private eventsService, @Inject(TicketStorage) private ticketStore, private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
		//console.log('new - eventViewChild is ' + this.eventViewChild);
		this.mdIconRegistry.addSvgIcon('up-arrow', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/up-arrow.svg'));
		this.mdIconRegistry.addSvgIcon('menu', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/menu.svg'));
	}
	
	public ngAfterContentInit() : void {
		//console.log('ngAfterContentInit - eventContentChild is ' + this.eventContentChild);
		//console.log(this.events);
	}
  
	public ngAfterViewInit() : void {
		//console.log('ngAfterViewInit - eventViewChildren is ' + this.eventViewChildren);
		//this.events = this.eventViewChildren.toArray();
		//console.log(this.events);
	}
	
	public ngOnInit() : void {
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
		let eventEntity = new EventEntity();
		eventEntity.id = 7;
		eventEntity.name = "Event";
		eventEntity.contentUid = "Event";
		eventEntity.startTime = new Date();
		eventEntity.endTime = new Date();
		this.events =
		[
			eventEntity, eventEntity, eventEntity, eventEntity, eventEntity, eventEntity, eventEntity
		];
		//this.eventsService.getEvents().then((eventItem: Array<IEventEntity>) => this.events = eventItem);
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
	
	public trackByEvents(index: number, eventEntity: IEventEntity) : number {
		return eventEntity.id;
	}
	
	//@HostListener('mouseenter', ['$event.target'])
	public onMouseEnter(target: any){
		//target.toggle();
		this.menuState = this.menuState === 'out' ? 'in' : 'out';
		//target.opened = true;
	}

	//@HostListener('mouseleave', ['$event.target'])
	public onMouseLeave(target: any){
		//target.toggle();
		this.menuState = (this.menuState === 'in') ? 'out' : 'in';
		//target.opened = true;
	}
	
	private sliderConfig: any =
	{
		//behaviour: 'drag',
		connect: true,
		start: [1000, 4000],
		keyboard: true,
		step: 100,
		pageSteps: 100,
		range:
		{
			min: 0,
			max: 5000
		},
		pips:
		{
			mode: 'count',
			density: 2,
			values: 6,
			stepped: true
		}
	};
	
	public sliderModel: number[] = [0, 5000];
	private onSliderChange(event) : void {
		console.log(this.sliderModel);
	}
}
