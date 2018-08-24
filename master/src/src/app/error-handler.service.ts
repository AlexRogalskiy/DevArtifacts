import {Injectable} from '@angular/core';
import {Logger} from './logger-service';

@Injectable()
export class ErrorHandler {

	constructor(private logger: Logger) { }

	private handleError(error: any) : Promise<any> {
		console.error('Internal server error', error);
		this.logger.log(error);
		return Promise.reject(error.message || error);
	}
}