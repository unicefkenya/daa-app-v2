import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GuardianDetailsPage } from './guardian-details.page';
import { MyformModule } from 'src/app/shared/myform/myform.module';

const routes: Routes = [
  {
    path: '',
    component: GuardianDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyformModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GuardianDetailsPage]
})
export class GuardianDetailsPageModule { }
