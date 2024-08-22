import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OverallReportsPage } from './overall-reports.page';
import { ChartsModule } from '../charts/charts.module';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { AuthGuard } from '../guard/auth/auth.guard';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: OverallReportsPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  providers: [DatePicker],
  declarations: [OverallReportsPage]
})
export class OverallReportsPageModule { }
