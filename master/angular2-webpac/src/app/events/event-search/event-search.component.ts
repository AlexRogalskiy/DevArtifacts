import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, Output, Input, EventEmitter, HostListener } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';

import { EventsService } from '../events.service';
import { EventEntity } from '../event-card/event-entity.component';

/*@Directive({
    selector: '.search-box', 
})
class SearchDirective {
    constructor() {}
	
    @HostListener('focus', ['$event.target'])
    public onFocus(target) : void {
        console.log("Focus called");
    }
	
    @HostListener('focusout', ['$event.target'])
    public onFocusout(target) : void {
		console.log("Focus out called");
    }
}*/
  
@Component({
	selector: 'event-search',
	template:
	`
		<div id="search-component">
			<div [formGroup]="searchForm" class="search-form">
				<input type="text" id="search-box" class="search-box" formControlName="searchTerm" (focus)="onFocusSearch($event.target)" (focusout)="onFocusOutSearch($event.target)" placeholder="{{ searchPlaceholder }}" />
			</div>
		</div>
	`,
	//styleUrls: [ './event-search.component.css' ],
	//providers: [EventsService]
	//directives: [ SearchDirective ],
	styles:
	[
		`
		@import url("//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css");
		.search-form input {
			min-width: 350px;
			height: 32px;
			//background: #fcfcfc;
			border: 1px solid #aaa;
			border-radius: 5px;
			box-shadow: 0 0 3px #ccc, 0 10px 15px #2184cd inset;
			text-indent: 7%;
			background-repeat: no-repeat;
			background-size: 60% 60%;
			background-position: -60% 50%;
			background-color: #2184cd;
		}
		
		.search-form .search-box::-webkit-input-placeholder {
		   color: #fff;
		}
		 
		.search-form .search-box:-moz-placeholder { /* Firefox 18- */
		   color: #fff;
		}
		 
		.search-form .search-box::-moz-placeholder {  /* Firefox 19+ */
		   color: #fff;
		}
		 
		.search-form .search-box:-ms-input-placeholder {  
		   color: #fff;
		}
		.search-box:focus {
			background-color: white!important;
			text-indent: 6%;
			padding-left: 6%;
		}
		`
	]
})

export class EventSearch implements OnInit {
	private events: Observable<EventEntity[]>;
	private searchTerm = new Subject<string>();
	
	@Output() change: EventEmitter<Object> = new EventEmitter<Object>();
	
	public searchForm: FormGroup;
	public searchPlaceholder: string = "Найти";
	private searchField : FormControl;
	//private searchTerm: Observable<string>;
	
	constructor(@Inject(EventsService) private eventsService, private router: Router) {}
	
	//public search(term: string): void {
	//	this.searchTerm.next(term);
	//}
	
	public ngOnInit(): void {
		this.searchForm = new FormGroup({searchTerm: new FormControl('',[<any>Validators.required])});
		this.searchField = (<FormControl>this.searchForm.controls['searchTerm']);
		this.searchFieldChanges();
		/*this.events = this.searchField
			.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.switchMap(term => term ? this.eventsService.searchEventsByName(term) : Observable.of<EventEntity[]>([]))
			.catch(error => {
				console.log(error);
				return Observable.of<EventEntity[]>([]);
			});*/
			//.catch(this.errorHandler);
			//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
	}
	
	private searchFieldChanges() : void {
		this.searchField.valueChanges.debounceTime(400).distinctUntilChanged()
													   .switchMap(term => (term && term.length > 0) ? this.eventsService.searchEventsByName(term) : this.eventsService.getEvents())
													   .subscribe(value => this.change.emit({text: value}));
	}
	
	/*public gotoDetail(event: EventEntity): void {
		let link = ['/event', event.id];
		this.router.navigate(link);
	}*/
	
	@HostListener('focusout', ['$event.target'])
	public onFocusOutSearch(target) : void {
		target.style.backgroundImage = 'none';
	}
	
	@HostListener('focus', ['$event.target'])
	public onFocusSearch(target) : void {
		target.style.backgroundImage = 'url(../../assets/icon/search.svg)';
	}
}