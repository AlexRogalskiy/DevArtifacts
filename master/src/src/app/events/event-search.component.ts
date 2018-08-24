import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, OnInit, Inject, Output, Input, EventEmitter} from '@angular/core';
import {Router}            from '@angular/router';
import {Observable}        from 'rxjs/Observable';
import {Subject}           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';

import {EventsService} from './events.service';
import {EventEntity} from './event-card/event-entity.component';

@Component({
	selector: 'event-search',
	template:
	`
		<div id="search-component">
			<div [formGroup]="searchForm" class="search-form">
				<input type="text" id="search-box" class="search-box" formControlName="searchTerm" placeholder="{{ searchMask }}" />
			</div>
		</div>
	`,
	//styleUrls: [ './event-search.component.css' ],
	//providers: [EventsService]
})

export class EventSearch implements OnInit {
	private events: Observable<EventEntity[]>;
	private searchTerm = new Subject<string>();
	
	@Output() change: EventEmitter<Object> = new EventEmitter<Object>();
	
	public searchForm: FormGroup;
	public searchMask: string = "Найти";
	private searchField : FormControl;
	//private searchTerm: Observable<string>;
	
	constructor(@Inject(EventsService) private eventsService, private router: Router) {
	}
	
	//public search(term: string): void {
	//	this.searchTerm.next(term);
	//}
	
	public ngOnInit(): void {
		this.searchForm = new FormGroup({searchTerm: new FormControl('',[<any>Validators.required])});
		this.searchField = (<FormControl>this.searchForm.controls['searchTerm']);
		this.subcribeToFormChanges();
		/*this.events = this.searchField
			.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.switchMap(term => term ? this.eventsService.searchEvents(term) : Observable.of<EventEntity[]>([]))
			.catch(error => {
				console.log(error);
				return Observable.of<EventEntity[]>([]);
			});*/
			//.catch(this.errorHandler);
			//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
	}
	
	private subcribeToFormChanges() : void {
		this.searchField.valueChanges.debounceTime(400).distinctUntilChanged().switchMap(term => (term && term.length > 0) ? this.eventsService.searchEvents(term) : this.eventsService.getEvents()).subscribe(value => this.change.emit({text: value}));//Observable.of<EventEntity[]>([])
	}
	
	/*public gotoDetail(event: EventEntity): void {
		let link = ['/event', event.id];
		this.router.navigate(link);
	}*/
}