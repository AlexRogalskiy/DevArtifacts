import {Events} from "./events.component";
import {Event} from "./event/event";
export const routes = [
  {
    path: 'events',
    children: [
      {path: '', component: Events},
      {path: ':id', component: Event}
    ]
  }
];
