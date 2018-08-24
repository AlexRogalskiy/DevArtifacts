/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import { Injectable, Inject } from "@angular/core";
import { IEventEntity, ITicketBundle } from "./event-card/event-entity.component";
//import { EventCard } from './event-card/event-card.component';
import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';
//import { AppConfig } from '../app.config';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EventsService {
	//private events: IEventEntity[] = [{id: 1, name: "event1", date: new Date()}, {id: 2, name: "event2", date: new Date()}];
	private perpage: number = 50;
	private start: number 	= 10;
	
	constructor(@Inject('APP_CONFIG') private config, public http: Http) {}
	
	public loadEvents(start: number = 0) : Promise<IEventEntity[]> {
		if (isNaN(start) || !Number.isInteger(start) ) return;
		return new Promise(resolve =>
		{
		  this.http.get(this.config.apiUrl + 'event?filter[limit]=' + this.perpage + '&filter[skip]=' + start)
			.map((response: Response) => response.json())
			.subscribe((data: IEventEntity) =>
			{
				resolve(data);
			});
		});
	}
	
	public loadInfinite(infiniteScroll: any) : void {
		console.log('doInfinite, start is currently ' + this.start);
		this.start += 10;
		this.loadEvents().then(() =>
		{
			infiniteScroll.complete();
		});
	}
	
	public getEventByID(eventId: number) : Promise<IEventEntity> {
		if ( isNaN(eventId) || !Number.isInteger(eventId) ) return;
		const url = `${this.config.apiUrl}/${eventId}`;
		return new Promise(resolve =>
		{
			this.http.get(url)
				.map((response: Response) => response.json())
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
				.subscribe((data: IEventEntity) =>
				{
					resolve(data);
				});
		});
	}
  
	public getEvents() : Promise<IEventEntity[]> {//Observable<IEventEntity[]>
		let headers = new Headers();
		headers.append('Accept', 'application/json');
		let options = new RequestOptions({ headers: headers });
		
		const url = `${this.config.apiUrl}`;
		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
				.subscribe((data: IEventEntity[]) =>
				{
					resolve(data);
				});
		});
	}

	public getAvailableTickets(eventId: number) : Promise<ITicketBundle> {
		if ( isNaN(eventId) || !Number.isInteger(eventId) ) return;
		const url = `${this.config.apiUrl}/${eventId}/ticket/bundle`;
		return new Promise(resolve =>
		{
			this.http.get(url)
				.map((response: Response) => response.json())
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
				.subscribe((data: ITicketBundle) =>
				{
					resolve(data);
				});
		});
	}
	
	public searchEvents(term: string) : Promise<IEventEntity[]> {
		var params = new URLSearchParams();
		//params.set('action', 'opensearch');
		//params.set('search', term);
		//params.set('format', 'json');
		
		const url = `${this.config.apiUrl}`;
		return new Promise(resolve =>
		{
			this.http.get(url, params)
				.map((response: Response) => response.json())
				.map((item) => { return item.filter(item => {return item.name.toLowerCase().indexOf(term) !== -1}); })
				.subscribe((data: IEventEntity[]) =>
				{
					resolve(data);
				});
			//.catch(this.errorHandler);
			//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
		});
		/*return this.jsonp
					.get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', { params })
					.toPromise()
					.then((response) => response.json()[1]);
		return this.http
               .get(`app/heroes/?name=${term}`)
               .map(response => response.json().data as Hero[]);*/
	}
}