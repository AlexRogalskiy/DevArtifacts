import * as offline from 'offline-plugin/runtime';
import { translator } from './js/translator';
import './app.styl';

translator(); 
offline.install({
  onUpdateReady: function() {
    offline.applyUpdate();
  }
});
