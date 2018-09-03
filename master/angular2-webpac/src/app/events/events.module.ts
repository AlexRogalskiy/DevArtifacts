import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {routes} from "./events.routes";
import {MaterialModule} from "@angular/material";
import {Events} from "./events.component";
import {Event} from "./event/event";
import {EventCard} from "./event-card/event-card";
import {CommonModule} from "@angular/common";


@NgModule({
	declarations: [
		EventCard,
		Event,
		Events,
	],
	imports: [
		CommonModule,
		MaterialModule.forRoot(),
		RouterModule.forChild(routes)
	],
})
export class EventsModule {
	public static routes = routes;
}
