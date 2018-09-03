import { Component, ViewEncapsulation, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { Observable } from 'rxjs/Rx';

export interface IIconEntity
{
    label: string,
	path: string
}

@Injectable()
export class IconListService {
	//private mdIconRegistry: MdIconRegistry;
	//private sanitizer: DomSanitizer
	
	constructor(private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
		/*this.mdIconRegistry
			.addSvgIcon('favorite', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/favorite.svg'))
			.addSvgIcon('settings', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/settings.svg'))
			.addSvgIcon('share', 	this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/share.svg'))
			.addSvgIcon('up-arrow', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/up-arrow.svg'));
			//.addSvgIconSetInNamespace('core', sanitizer.bypassSecurityTrustResourceUrl('../assets/icon/favorite.svg'))
			//.registerFontClassAlias('fontawesome', 'fa');*/
	}
	
	public register(itemList: Array<IIconEntity>) : void {
		Observable.from(itemList).subscribe((value) => this.mdIconRegistry.addSvgIcon(value.label, this.sanitizer.bypassSecurityTrustResourceUrl(value.path)));
	}
}