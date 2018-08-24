import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from "@angular/http";
import {MaterialModule} from "@angular/material";
import {NgModule, ApplicationRef} from "@angular/core";
import {removeNgStyles, createNewHosts, createInputTransfer} from "@angularclass/hmr";
import {RouterModule} from "@angular/router";
import {CustomFormsModule} from 'ng2-validation'
/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from "./environment";
import {ROUTES} from "./app.routes";
// App is our top level component
import {AppComponent} from "./app.component";
import {APP_RESOLVER_PROVIDERS} from "./app.resolver";
import {AppState, InternalStateType} from "./app.service";
import {AboutComponent} from "./about";
import {NoContentComponent} from "./no-content";
import "../styles/styles.scss";
import "../styles/headings.css";
import {Events} from "./events/events.component";
import {Event} from "./events/event/event.component";
import {EventEntity} from "./events/event-card/event-entity.component";
import {EventCard} from "./events/event-card/event-card.component";
import {EventsService} from "./events/events.service";

import {InfiniteScrollModule} from 'angular2-infinite-scroll';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import {Logger} from "./logger-service";
import {Menu} from './menu.component';
import {VENUE_DI_CONFIG} from './app.config';
import {ErrorHandler} from "./error-handler.service";

import {EventSearch} from "./events/event-search.component";
import {ScrollButton} from "./events/scroll-button.component";
import {ShoppingCartService} from './shopping-cart/shopping-cart.service';
import {TicketStorage} from './shopping-cart/ticket-storage.component';

//import {DialogComponent} from './shopping-cart/dialog.component';
//import {DialogAnchorDirective} from './shopping-cart/dialoganchor.directive';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal';
import {ShoppingCartDialog} from './shopping-cart/shopping-cart-dialog.component';

import {WidgetToolbar} from './widget-toolbar.component';
import {TicketCounter} from './events/event/ticket-counter.component';
import {ShoppingCart} from './shopping-cart/shopping-cart.component';
import {ShoppingCartItem} from './shopping-cart/shopping-cart-item.component';

import {IconListService} from "./icon-list.service";
import {EventCardIconList} from "./events/event-card/event-card-icon-list.component";

import {MdMenuModule} from '@angular/material/menu';
import {LocalStorageService, SessionStorageService, Ng2Webstorage} from 'ng2-webstorage';

import { OrderBy } from './order-by-pipe.component';
import { AuthService }      from './auth.service';

//import {OpaqueToken} from '@angular/core';
//export let APP_CONFIG = new OpaqueToken('app.config');

// Application wide providers
const APP_PROVIDERS = [
	...APP_RESOLVER_PROVIDERS,
	AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AboutComponent,
    Events,
    Event,
    NoContentComponent,
	EventSearch,
	EventCard,
	TicketCounter,
	ShoppingCart,
	ShoppingCartItem,
	Menu,
	ScrollButton,
	ShoppingCartDialog,
	WidgetToolbar,
	EventCardIconList,
	OrderBy
  ],
  imports: [
    BrowserModule,
    FormsModule,
	ReactiveFormsModule,
	CustomFormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(ROUTES/*, { useHash: true, preloadingStrategy: PreloadAllModules }*/),
	Ng2PageScrollModule.forRoot(),
	InfiniteScrollModule,
	MdMenuModule,
	Ng2Bs3ModalModule,
	Ng2Webstorage,
	Ng2Webstorage.forRoot({ prefix: 'kassir-widget', separator: '.' })
	//LocalStorageModule.withConfig({
   //     prefix: 'kassir-widget',
    //    storageType: 'sessionStorage'
   // })
  ],
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS,
	EventEntity,
	{ provide: AuthService, useClass: AuthService },
	{ provide: IconListService, useClass: IconListService },
	{ provide: LocalStorageService, useClass: LocalStorageService },
	{ provide: SessionStorageService, useClass: SessionStorageService },
	{ provide: Logger, useClass: Logger },
	{ provide: ErrorHandler, useClass: ErrorHandler },
	{ provide: EventsService, useClass: EventsService },
	{ provide: ShoppingCartService, useClass: ShoppingCartService },
	{ provide: TicketStorage, useClass: TicketStorage },
	{ provide: 'APP_CONFIG', useValue: VENUE_DI_CONFIG }
  ]
})

export class AppModule {
	constructor(public appRef: ApplicationRef, public appState: AppState) {}

	public hmrOnInit(store: StoreType) {
		if (!store || !store.state) {
			return;
		}
		console.log('HMR store', JSON.stringify(store, null, 2));
		// set state
		this.appState._state = store.state;
		// set input values
		if ('restoreInputValues' in store) {
			let restoreInputValues = store.restoreInputValues;
			setTimeout(restoreInputValues);
		}

		this.appRef.tick();
		delete store.state;
		delete store.restoreInputValues;
	}

	public hmrOnDestroy(store: StoreType) {
		const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
		// save state
		const state = this.appState._state;
		store.state = state;
		// recreate root elements
		store.disposeOldHosts = createNewHosts(cmpLocation);
		// save input values
		store.restoreInputValues = createInputTransfer();
		// remove styles
		removeNgStyles();
	}

	public hmrAfterDestroy(store: StoreType) {
		// display new elements
		store.disposeOldHosts();
		delete store.disposeOldHosts;
	}
}
