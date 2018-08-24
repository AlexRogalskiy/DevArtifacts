
export class EventEntity implements IEventEntity {
	public id: 				number;
	public name:			string;
	public contentUid:		string;
	public startTime:		Date;
	public endTime:			Date;
	public posterSrc?: 		string;
	public posterThumb?: 	string;
	public products?:		Array<IEventProductEntity> = [];
	
	public title: 			string;
	public subTitle: 		string;
	public content: 		string;
	public hide: 			boolean = false;

	constructor() {}

	public toggle() : void {
		this.hide = !this.hide;
	}
	
	public setTitle(title: string) : void {
		this.title = title;
	}
	
	public getTitle() : string {
		return this.title;
	}
	
	public setSubTitle(subTitle: string) : void {
		this.subTitle = subTitle;
	}
	
	public getSubTitle() : string {
		return this.subTitle;
	}
	
	public setContent(content: string) : void {
		this.content = content;
	}
	
	public getContent() : string {
		return this.content;
	}
	
	public setStartDate(startTime: Date) : void {
		this.startTime = startTime;
	}
	
	public getStartDate() : Date {
		return this.startTime;
	}
	
	public setEndDate(endTime: Date) : void {
		this.endTime = endTime;
	}
	
	public getEndDate() : Date {
		return this.endTime;
	}
	
	public setPosterSrc(posterSrc: string) : void {
		this.posterSrc = posterSrc;
	}
	
	public getPosterSrc() : string {
		return this.posterSrc;
	}
	
	public setPosterThumb(posterThumb: string) : void {
		this.posterThumb = posterThumb;
	}
	
	public getPosterThumb() : string {
		return this.posterThumb;
	}
	
	public setProducts(products: Array<IEventProductEntity>) : void {
		this.products = products;
	}
	
	public getProducts() : Array<IEventProductEntity> {
		return this.products;
	}
}

export interface IEventProductEntity
{
	id: 			number;
	eventId:		number;
	name: 			string;
	contentUid: 	string;
	startTime: 		Date;
	endTime: 		Date;
	couponLimit:	number;
	couponPrice:	number;
	couponExist:	number;
}

export class EventProductEntity implements IEventProductEntity
{
	id: 			number;
	eventId: 		number;
	contentUid: 	string;
	name: 			string;
	startTime: 		Date;
	endTime: 		Date;
	couponLimit:	number;
	couponPrice:	number;
	couponExist:	number;
}

export interface ITicketBundle
{
	id: 		number;
	eventId: 	number;
	price: 		number;
	limit: 		number;
	exist: 		number;
}

export interface IEventEntity
{
	id: 			number;
	eventId?:		number;
	name: 			string;
	contentUid: 	string;
	startTime: 		Date;
	endTime: 		Date;
	posterSrc?: 	string;
	posterThumb?: 	string;
	products?: 		Array<IEventProductEntity>;
}

