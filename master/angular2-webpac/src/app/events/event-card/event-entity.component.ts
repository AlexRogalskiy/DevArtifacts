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

export class EventEntity implements IEventEntity {
	public id: 				number;
	public name:			string;
	public contentUid:		string;
	public startTime:		Date;
	public endTime:			Date;
	public posterSrc?: 		string = null;
	public posterThumb?: 	string = null;
	public products?:		Array<IEventProductEntity> = [];
	
	public title?: 			string = null;
	public subTitle?: 		string = null;
	public content?: 		string = null;
	public hide?: 			boolean = false;

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
	constructor(
		public id: 			number,
		public eventId: 	number,
		public contentUid: 	string,
		public name: 		string,
		public startTime: 	Date,
		public endTime: 	Date,
		public couponLimit: number,
		public couponPrice: number,
		public couponExist: number
	) {}
}

export interface ITicketBundle
{
	id: 		number;
	eventId: 	number;
	price: 		number;
	limit: 		number;
	exist: 		number;
}

export class TicketBundle implements ITicketBundle
{
	constructor(
		public id:		number,
		public eventId:	number,
		public price: 	number,
		public limit: 	number,
		public exist: 	number
	) {}
}

