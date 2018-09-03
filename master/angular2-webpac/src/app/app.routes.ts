import {Routes} from "@angular/router";
import {Events} from "./events/events.component";
import {Event} from "./events/event/event.component";
import {NoContentComponent} from "./no-content";

export const ROUTES: Routes = [
	{path: '', component: Events},
	{path: 'event/:id', component: Event},
  // {path: 'detail', loadChildren: './+detail#DetailModule'},
  // {path: 'barrel', loadChildren: './+barrel#BarrelModule'},
	{path: '**', component: NoContentComponent},
];
