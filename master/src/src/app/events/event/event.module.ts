import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {routes} from './event.routes';
import {Event} from './event.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    Event,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class EventModule {
	public static routes = routes;
}
