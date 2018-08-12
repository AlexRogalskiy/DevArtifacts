
import { messages } from './messages.component';

export const MessagesModule = angular
  .module('page.messages', [
    'ngMaterial',
  ])
  .component('messages', messages)
  .name;