import { Injectable, Inject } from '@angular/core';
import { TicketStorage } from './ticket-storage.component';

@Injectable()
export class ShoppingCartService {
	public messages = [{id: 1, value: 11}, {id: 2, value: 22}, {id: 3, value: 33}];
	
	constructor(@Inject(TicketStorage) private ticketStore) {};
	
	public getItems() : Array<any>{
		return this.messages;
	}
	
	public update(id, value) : void {
		this.messages = this.messages.map(m => (m.id === id) ? {id, value} : m);
	}
}