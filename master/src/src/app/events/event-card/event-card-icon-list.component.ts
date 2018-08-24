import { Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { IconListService, IIconEntity} from '../../icon-list.service';

import { Observable } from 'rxjs/Rx';

@Component({
	//moduleId: module.id,
	selector: 'md-icons',
	template:
	`
		<div class="icons">
			<button class="md-icon-button md-button md-ink-ripple" md-theme="cyan" md-tooltip="Favorite" tooltip-position="below" aria-label="Избранное">
				<md-icon svgIcon="favorite" class="ng-scope md-default-theme" aria-hidden="true"></md-icon>
				<div class="md-ripple-container"></div>
			</button>
			<button class="md-icon-button md-button md-default-theme md-ink-ripple" md-theme="cyan" md-tooltip="Options" tooltip-position="below" aria-label="Опции">
				<md-icon svgIcon="options" class="ng-scope md-default-theme" aria-hidden="true"></md-icon>
				<div class="md-ripple-settings"></div>
			</button>
			<button class="md-icon-button md-button md-ink-ripple" md-theme="cyan" md-tooltip="Share" tooltip-position="below" aria-label="Поделиться">
				<md-icon svgIcon="share" class="ng-scope md-default-theme" aria-hidden="true"></md-icon>
				<div class="md-ripple-container"></div>
			</button>
		</div>
	`,
	encapsulation: ViewEncapsulation.None
})

export class EventCardIconList implements OnInit {
	private iconSet: Array<IIconEntity> =
	[
		{label: 'favorite', path: '../assets/icon/favorite.svg'},
		{label: 'options', 	path: '../assets/icon/options.svg'},
		{label: 'share', 	path: '../assets/icon/share.svg'}
	];
	
	public ngOnInit(): void {
		//this.iconList.register(this.iconSet);
		this.registerIcons(this.iconSet);
	}
	
	constructor(private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer, @Inject(IconListService) private iconList: IconListService) {}
	
	public registerIcons(itemList: Array<IIconEntity>) : void {
		Observable.from(itemList).subscribe((value) => this.mdIconRegistry.addSvgIcon(value.label, this.sanitizer.bypassSecurityTrustResourceUrl(value.path)));
	}
}