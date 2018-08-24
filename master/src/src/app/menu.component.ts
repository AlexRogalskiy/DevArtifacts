import {Component, ViewChild, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {MdMenuTrigger} from "@angular/material/menu";

import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { IIconEntity } from './icon-list.service';
import { Observable } from 'rxjs/Rx';

/**
 * Created by pavel.antoshenko on 1/30/2017.
 */
@Component({
	selector: 'menu-bar',
	template: 
	`
		<button md-button [md-menu-trigger-for]="menu">Меню</button>
		
		<md-menu x-position="after"  y-position="below" #menu="mdMenu">
			<button md-menu-item *ngFor="let item of itemList | orderBy:'id'" (click)="onAction($event, item)" [disabled]="item.disabled">
				<md-icon svgIcon="{{ item.icon }}" aria-hidden="true"></md-icon>
				{{ item.label }}
			</button>
		</md-menu>
	`
})

export class Menu implements OnInit {
	@ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
	@Output() update: EventEmitter<Object> = new EventEmitter<Object>();
	
	private itemList: Array<IMenuItem> =
	[
		{id: 1, label: 'Главная', 			icon: 'main'},
		{id: 2, label: 'Цветовая схема', 	icon: 'theme'},
		{id: 3, label: 'Настройки', 		icon: 'settings', disabled: true},
		{id: 4, label: 'Справка', 			icon: 'help'},
		{id: 5, label: 'Выход', 			icon: 'exit'}
	];
	
	private iconSet: Array<IIconEntity> =
	[
		{label: 'main', 	path: '../assets/icon/main.svg'},
		{label: 'theme', 	path: '../assets/icon/theme.svg'},
		{label: 'settings', path: '../assets/icon/settings.svg'},
		{label: 'help', 	path: '../assets/icon/help.svg'},
		{label: 'exit',  	path: '../assets/icon/exit.svg'}
	];
	
	constructor(private route: Router, private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
		this.mdIconRegistry.addSvgIcon('main', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/main.svg'));
	}
	
	public ngOnInit() : void {
		this.registerIcons(this.iconSet);
	}
	
	public registerIcons(icons: Array<IIconEntity>) : void {
		Observable.from(icons).subscribe((value) => this.mdIconRegistry.addSvgIcon(value.label, this.sanitizer.bypassSecurityTrustResourceUrl(value.path)));
	}
	
	public openMenuBar() : void {
		this.trigger.openMenu();
	}
	
	public onAction(event, item) : void {
		switch(item.id) {
			case 1:
				this.route.navigate(['/']);
				break;
			case 2:
				this.update.emit({text: item});
				break;
			default:
				break;
		}
	}
}

export interface IMenuItem
{
    id: number;
	label: string;
	icon?: string;
	path?: string;
	disabled?: boolean;
}

/*
		{id: 1, label: 'Главная', icon: 'main'},
		{id: 2, label: 'Цветовая схема', icon: 'theme'},
		{id: 3, label: 'Настройки', icon: 'settings', disabled: true},
		{id: 4, label: 'Справка', icon: 'help'},
		{id: 5, label: 'Выход', icon: 'exit'}
*/
