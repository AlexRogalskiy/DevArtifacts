import { Component, HostListener, Input } from '@angular/core';

@Component({
	selector: 'datepicker',
	template:
	  `
		<md2-datepicker [(ngModel)]="model"
						[type]="type"
						[placeholder]="placeholder"
						[format]="format"
						[disabled]="disabled"
						
						[min]="minDate"
						[max]="maxDate"
						
						required
						(change)="onChangeDatePicker($event)">
		</md2-datepicker>
		
		<!--
		<h4>Дата</h4>
		<div>
			<md2-datepicker [(ngModel)]="date"
							type="date"
							placeholder="Date"
							format="DD/MM/YYYY"
							(change)="onChangeDatePicker($event)">
			</md2-datepicker>
		</div>
		<h4>Время</h4>
		<div>
			<md2-datepicker [(ngModel)]="time"
							type="time"
							placeholder="Time"
							format="HH:mm"
							(change)="onChangeDatePicker($event)">
			</md2-datepicker>
		</div>
		<div>
			<md2-datepicker [(ngModel)]="date"
							type="date"
							[disabled]="disabled"
							placeholder="Date"
							format="DD/MM/YYYY"
							(change)="onChangeDatePicker($event)">
			</md2-datepicker>
		</div>
		<h4>Min/Max Date</h4>
		<div>
			<md2-datepicker [(ngModel)]="date"
							type="date"
							[min]="minDate"
							[max]="maxDate"
							placeholder="Date Time"
							format="DD/MM/YYYY"
							(change)="onChangeDatePicker($event)">
			</md2-datepicker>
		</div>
		-->
	  `,
})

export class DatePicker {
	@Input('model') model: any 					= new Date();
	@Input('type') type: any 					= "datetime";
	@Input('placeholder') placeholder: string 	= "";
	@Input('format') format: string 			= "DD/MM/YYYY HH:mm";
	@Input('disabled') disabled: boolean 		= false;
	
	@Input('min') minDate: any 		= '';
	@Input('max') maxDate: any 		= '';
	
	//private date: any = '2016-09-15';
	//private time: any = '12:10';
	//private minDate: any = '2016-07-15';
	//private maxDate: any = '2016-12-15';
	constructor() {}
  
	@HostListener('change', ['$event.target'])
	private onChangeDatePicker(event) : void {
		console.log('Changed data: ', event);
	}
}

