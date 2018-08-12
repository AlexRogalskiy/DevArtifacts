import { StartModule }    from './start/start.module';
import { MessagesModule } from './messages/messages.module';

export const PagesModule = angular
  .module('app.pages', [
    StartModule,
    MessagesModule
  ])
  .name;
