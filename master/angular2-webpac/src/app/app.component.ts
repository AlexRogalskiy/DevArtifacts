/*
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

/*
 * App Component
 * Top Level Component
 */
@Component({
	selector: 'app',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./app.component.css'],
	templateUrl: './app.template.html'
})

export class AppComponent implements OnInit {
	public angularclassLogo = 'assets/img/angularclass-avatar.png';
	public name = 'Angular 2 Webpack Starter';
	public url = 'https://twitter.com/AngularClass';
  
	public isDarkTheme: boolean = false;
  
	constructor(public appState: AppState) {}

	public ngOnInit() {
		console.log('Initial App State', this.appState.state);
	}
	
	public onUpdate(event) : void {
		console.log('onUpdate');
	}
}
