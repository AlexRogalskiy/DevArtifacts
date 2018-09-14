import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Entrie } from '../../models/entrie';
import { EntriesService } from '../../providers/entries';
import { SignaturePage } from '../signature/signature';

/*
  Generated class for the EntrieDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var signature: any;

@Component({
  selector: 'page-entrie-detail',
  templateUrl: 'entrie-detail.html'
})
export class EntrieDetail {
  entrie: Entrie[];
  index: number;
  signatures: any;
  signature: any;
  entries: any;
  
  constructor(public navCtrl: NavController, private navParams: NavParams, private entriesService: EntriesService, public alertCtrl: AlertController, public storage: Storage) {
    this.index = navParams.get('index');
    /*
    Use when API is ready
    entriesService.loadDetail(this.index).subscribe(entrie => {
      this.entrie = entrie;
    })*/
    this.storage.get('entries').then((val) => {
      this.entries = JSON.parse(val);
      this.entrie = this.entries[this.index];

      this.storage.get('signatures').then((val) => {
        if ( val != null ){
            this.signatures = JSON.parse(val);
            for (var i = 0, len = this.signatures.length; i < len; i++) {
              if( this.signatures[i].entrie == this.index ){
                this.signature = this.signatures[i];
              }
            }
        }
      });
    });    
  }

  ionViewDidLoad() {
  }

  goToSignature(){
    let param = this.navParams.get('index');;
    this.navCtrl.push(SignaturePage, {param});
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Supervisor',
      message: "Sign in to insert your signature",
      inputs: [
        {
          name: 'username',
          placeholder: 'username'
        },
        {
          name: 'password',
          placeholder: 'password'
        }
      ],
      buttons: [
        {
          text: 'Login',
          handler: data => {
            let param = this.index;
            this.navCtrl.push(SignaturePage, {param});
          }
        }
      ]
    });
    prompt.present();
  }

}
