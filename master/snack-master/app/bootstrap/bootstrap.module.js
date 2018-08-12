import { RoutingModule } from './routing/routing.module';

export const BootStrapModule = angular
  .module('bootstrap', [
    RoutingModule
  ])
  .name;