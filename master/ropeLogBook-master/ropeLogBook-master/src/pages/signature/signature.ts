import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Entrie } from '../../models/entrie';
import { EntrieDetail } from '../entrie-detail/entrie-detail';
/*
  Generated class for the Signature page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var SignaturePad;

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html'
})
export class SignaturePage {
  param: number;
  signaturePad: any;
  signature: any;
  signatures: any;
  entries: any;

  constructor(public navCtrl: NavController, private navParams: NavParams, public alertCtrl: AlertController, public storage: Storage) {
    this.param = navParams.get('param');

    this.storage.get('signatures').then((val) => {
       if( val == null ){
         this.storage.set('signatures', JSON.stringify([]) ); 
       }
    });
    this.storage.get('entries').then((val) => {
        this.entries = JSON.parse(val);
        console.log(this.entries);
    });    
  }

  ionViewDidLoad() {
    let canvas = document.querySelector('#signature');
    this.signaturePad = new SignaturePad(canvas);
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: 'Your signature was registered',
      buttons: [
        {
          text: 'OK',
          handler: data => {
            let index = this.param;
            this.navCtrl.push(EntrieDetail, {index});
          }
        }
      ]
    });
    alert.present();
  }
  showErro() {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: 'Preencha seu ID',
      buttons: ['OK']
    });
    alert.present();
  }

  saveSignature(supId){
    if ( supId == '' ){
      this.showErro();
      return
    }
    
    let data = this.signaturePad.toDataURL('image/png');

    this.signature = {
      entrie: this.param,
      id: supId,
      dataurl: data
    }

    //Saves signature
    this.storage.get('signatures').then((val) => {
      this.signatures = JSON.parse(val);
      this.signatures.push(this.signature);
      this.storage.set('signatures', JSON.stringify(this.signatures) );
    });
    

    this.entries[this.param].signature = true;
    this.storage.set('entries', JSON.stringify(this.entries) );   
    
    this.showAlert();
  }

  clearSignature(){
    this.signaturePad.clear();
  }
}
