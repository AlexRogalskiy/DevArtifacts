import { Event } from './event.component';

export const routes = [
	{ path: '', children: [
		{ path: '/event/:id', component: Event, pathMatch: 'full' }
	]},
];
