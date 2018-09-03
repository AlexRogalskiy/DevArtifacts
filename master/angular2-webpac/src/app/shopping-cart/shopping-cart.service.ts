/**
 * Created by pavel.antoshenko on 1/26/2017.
 */
import { Injectable, Inject } from "@angular/core";
import { ITicketEntity } from "../shopping-cart/ticket-storage.component";
import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ShoppingCartService {
	
	constructor(@Inject('APP_CONFIG') private config, public http: Http) {}

	public getAvailableTickets(eventId: number) : Promise<ITicketEntity[]> {
		if (isNaN(eventId) || !Number.isInteger(eventId)) return Promise.resolve([]);
		const url = `${this.config.apiUrl}/${eventId}/ticket/bundle`;
		return new Promise(resolve =>
		{
			this.http.get(url)
				.map((response: Response) => response.json())
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
				.subscribe((data: ITicketEntity[]) =>
				{
					resolve(data);
				});
		});
	}
	
	public getTickets() : Promise<ITicketEntity[]> {
		let headers = new Headers();
		headers.append('Accept', 'application/json');
		let options = new RequestOptions({ headers: headers });
		
		const url = `${this.config.apiUrl}/ticket`;
		return new Promise(resolve =>
		{
			this.http.get(url, options)
				.map((response: Response) => response.json())
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
				.subscribe((data: ITicketEntity[]) =>
				{
					resolve(data);
				});
		});
	}
	
	public getTicket(ticketId: number) : Promise<ITicketEntity> {
		if (isNaN(ticketId) || !Number.isInteger(ticketId)) return Promise.resolve(null);
		var params = new URLSearchParams();
		//params.set('action', 'opensearch');
		//params.set('search', term);
		//params.set('format', 'json');
		
		const url = `${this.config.apiUrl}/ticket/${ticketId}`;
		return new Promise(resolve =>
		{
			this.http.get(url, params)
				.map((response: Response) => response.json())
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Internal server error'))
				.subscribe((data: ITicketEntity) =>
				{
					resolve(data);
				});
		});
	}
	
	public addTicket(body: Object) : Promise<string> {
		let bodyString = JSON.stringify(body);
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let options = new RequestOptions({ headers: headers });
		
		const url = `${this.config.apiUrl}/ticket/`;
		return new Promise(resolve =>
		{
			this.http.post(url, body, options)
				.map((res: Response) => res.json())
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
				.subscribe((data: string) =>
				{
					resolve(data);
				});
		});
	}
	
	public updateTicket(body: Object, ticketId: number) : Promise<string> {
		if (isNaN(ticketId) || !Number.isInteger(ticketId)) return Promise.resolve(null);
		
		let bodyString = JSON.stringify(body);
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let options = new RequestOptions({ headers: headers });
		//${body['id']
		
		const url = `${this.config.apiUrl}/ticket/${ticketId}`;
		return new Promise(resolve =>
		{
			this.http.put(url, body, options)
				.map((res: Response) => res.json())
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
				.subscribe((data: string) =>
				{
					resolve(data);
				});
		});
	}
	
	public removeTicket(ticketId: number) : Promise<string> {
		if (isNaN(ticketId) || !Number.isInteger(ticketId)) return Promise.resolve(null);
		const url = `${this.config.apiUrl}/ticket/${ticketId}`;
		return new Promise(resolve =>
		{
			this.http.delete(url)
				.map((res: Response) => res.json())
				//.catch(this.errorHandler);
				//.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
				.subscribe((data: string) =>
				{
					resolve(data);
				});
		});
	}
}