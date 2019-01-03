import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EnetsPage } from '../enets/enets.page';
import { CreditPage } from '../credit/credit.page';
import { QrcodePage } from '../qrcode/qrcode.page';

import { IonicModule } from '@ionic/angular';

import { SeasonPage } from './season.page';

const routes: Routes = [
  {
    path: '',
    component: SeasonPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SeasonPage, EnetsPage, CreditPage, QrcodePage],
  entryComponents: [
    SeasonPage,
    EnetsPage,
    CreditPage,
    QrcodePage
  ],
})
export class SeasonPageModule {}
