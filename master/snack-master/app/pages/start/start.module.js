import { start } from './start.component';

export const StartModule = angular
  .module('page.start', [
    'ngMaterial',
    'app.services'
  ])
  .component('start', start)
  .name;
