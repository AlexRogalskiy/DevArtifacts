import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Entries } from '../entries/entries';
import { Entrie } from '../../models/entrie';

/*
  Generated class for the NewEntrie page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-new-entrie',
  templateUrl: 'new-entrie.html'
})
export class NewEntriePage {
  newEntrie: Entrie;
  entries: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage) {}

  ionViewDidLoad() {
  }

  saveEntrie(newDate, newCompany, newDetails, newLocation, newRopehours, newRigginghours, newMaxheight){    
    if( newDate == "" ||  newCompany == "" ||  newDetails == "" ||  newLocation == "" ||  newRopehours == "" ||  newRigginghours == "" ||  newMaxheight == "" ){
      this.showAlert();
      return;
    }
    this.newEntrie = {
      date: newDate,
      company: newCompany,
      details: newDetails,
      location: newLocation,
      ropehours: parseFloat(newRopehours),
      rigginghours: parseFloat(newRigginghours),
      maxheight: parseFloat( newMaxheight),
      signature: false
    }
    
    this.storage.get('entries').then((val) => {
       this.entries = JSON.parse(val);
       this.entries.push(this.newEntrie);
       this.storage.set('entries', JSON.stringify(this.entries) );

       this.navCtrl.push(Entries);
    });    
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Insert all fields',
      buttons: ['OK']
    });
    alert.present();
  }

}
