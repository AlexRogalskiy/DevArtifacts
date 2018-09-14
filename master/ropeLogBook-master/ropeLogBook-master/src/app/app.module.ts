import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';
import { Entries } from '../pages/entries/entries';
import { EntrieDetail } from '../pages/entrie-detail/entrie-detail';
import { NewEntriePage } from '../pages/new-entrie/new-entrie';
import { SignaturePage } from '../pages/signature/signature';
import { EntriesService } from '../providers/entries';

//import { Signature } from '../pages/signature/signature';

@NgModule({
  declarations: [
    MyApp,
    Entries,
    EntrieDetail,
    NewEntriePage,
    SignaturePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Entries,
    EntrieDetail,
    NewEntriePage,
    SignaturePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, EntriesService, Storage]
})
export class AppModule {}
