import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Entrie } from '../../models/entrie';
import { EntriesService } from '../../providers/entries';
import { EntrieDetail } from '../entrie-detail/entrie-detail';
/*
  Generated class for the Entries page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-entries',
  templateUrl: 'entries.html'
})
export class Entries {
  entries: Entrie[];
  entriesLocal: Entrie[];

  constructor(public navCtrl: NavController, private entriesService: EntriesService, public storage: Storage) {
    entriesService.load().subscribe(entries => {
      this.entriesLocal = entries;
      this.storage.get('entries').then((val) => {
          if( val == null ){
            this.storage.set('entries', JSON.stringify(this.entriesLocal) ); 
          } else{
            this.entries = JSON.parse(val);
          }
      }); 
    })
  }

  ionViewDidLoad() {
  }

  goEntrieDetail(index: number) {
    this.navCtrl.push(EntrieDetail, {index});
  }

}
