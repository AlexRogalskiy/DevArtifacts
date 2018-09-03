/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import { Injectable, Inject } from "@angular/core";
import { IEventEntity, ITicketBundle } from "./event-card/event-entity.component";
import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';
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
		if (isNaN(start) || !Number.isInteger(start) ) return Promise.resolve([]);
		const url = `${this.config.apiUrl}`;
		
		var params = new URLSearchParams();
		params.set('filter[limit]', this.perpage.toString());
		params.set('filter[skip]', start.toString());
		//params.set('format', 'json');
		
		return new Promise(resolve =>
		{
		  this.http.get(url, params)
			.map((response: Response) => response.json())
			.subscribe((data: IEventEntity[]) =>
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
		if (isNaN(eventId) || !Number.isInteger(eventId)) return Promise.resolve(null);
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
	
	public searchEventsByName(term: string) : Promise<IEventEntity[]> {
		if(!term || typeof term !== 'string') return Promise.resolve([]);
		if(0 === term.trim().length) return this.getEvents();
		
		var params = new URLSearchParams();
		//params.set('action', 'opensearch');
		//params.set('search', term);
		//params.set('format', 'json');
		
		const url = `${this.config.apiUrl}`;
		return new Promise(resolve =>
		{
			this.http.get(url, params)
				.map((response: Response) => response.json())
				.map((item) => { return item.filter(item => { return item.name.toLowerCase().indexOf(term) !== -1; }); })
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
				.subscribe((data: IEventEntity[]) =>
				{
					resolve(data);
				});
		});
		/*return this.jsonp
					.get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', { params })
					.toPromise()
					.then((response) => response.json()[1]);
		return this.http
               .get(`app/heroes/?name=${term}`)
               .map(response => response.json().data as Hero[]);*/
	}
	
	public searchEventsByDateRange(startDate: any, endDate: any = null) : Promise<IEventEntity[]> {
		var date1 = new Date(startDate), date2 = new Date(endDate);
		if(Object.prototype.toString.call(date1) !== '[object Date]' || (endDate && Object.prototype.toString.call(date2) !== '[object Date]')) return Promise.resolve([]);
		if(endDate && date1.getTime() >= date2.getTime()) return Promise.resolve([]);
		
		const url = `${this.config.apiUrl}`;
		var params = new URLSearchParams();
		//params.set('action', 'opensearch');
		//params.set('search', term);
		//params.set('format', 'json');
		return new Promise(resolve =>
		{
			this.http.get(url, params)
				.map((response: Response) => response.json())
				.map((item) => { return item.filter(item => {return (new Date(item.startTime).getTime() > date1.getTime() && ((endDate) ? new Date(item.startTime).getTime() < date2.getTime() : true)) }); })
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
				.subscribe((data: IEventEntity[]) =>
				{
					resolve(data);
				});
		});
	}
	
	public searchEventsByPriceRange(startPrice: number, endPrice: number) : Promise<IEventEntity[]> {
		if((isNaN(startPrice) || !Number.isInteger(startPrice)) || (isNaN(endPrice) || !Number.isInteger(endPrice))) return Promise.resolve([]);
		if(startPrice >= endPrice) return Promise.resolve([]);
		
		const url = `${this.config.apiUrl}`;
		var params = new URLSearchParams();
		//params.set('action', 'opensearch');
		//params.set('search', term);
		//params.set('format', 'json');
		return new Promise(resolve =>
		{
			this.http.get(url, params)
				.map((response: Response) => response.json())
				.map((item) => { return item.filter(item => { return (item.couponPrice >= startPrice && item.couponPrice <= endPrice); }); })
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
				.subscribe((data: IEventEntity[]) =>
				{
					resolve(data);
				});
		});
	}
}