import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AbsenceReasonPage } from './absence-reason.page';
import { PipesModule } from '../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';

const routes: Routes = [
  {
    path: '',
    component: AbsenceReasonPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    TranslateModule
  ],
  providers: [DatePicker],
  declarations: [AbsenceReasonPage]
})
export class AbsenceReasonPageModule { }
