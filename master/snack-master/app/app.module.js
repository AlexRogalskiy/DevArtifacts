import './styles/styles.scss';
import { AppComponent }     from './app.component';
import { BootStrapModule }  from './bootstrap/bootstrap.module';
import { PagesModule }      from './pages/pages.module';
import { ServicesModule }   from './services/services.module';

export const AppModule = angular
  .module('app', [
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'ui.router',
    'firebase',
    BootStrapModule,
    PagesModule,
    ServicesModule
  ])
  .component('app', AppComponent)
  .name;