
import { AppModule } from './app.module';

import angular from 'angular';
import firebase from 'firebase';
import config from '../firebase-config.json';

window.firebase = firebase;

firebase
  .initializeApp(config);

angular
  .element(document)
  .ready(function() {
    angular.bootstrap(document.body, [AppModule]);
  });

