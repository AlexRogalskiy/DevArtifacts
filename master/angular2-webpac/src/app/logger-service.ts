import {Injectable} from '@angular/core';

@Injectable()
export class Logger {
	private logs: string[] = [];
	
	public log(message: string) {
		message = `${new Date()}: ${message}`;
		this.logs.push(message);
		console.log(message);
	}
}