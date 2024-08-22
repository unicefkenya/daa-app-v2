import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddStudentPage } from './add-student.page';
import { MyformModule } from 'src/app/shared/myform/myform.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: AddStudentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyformModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [AddStudentPage]
})
export class AddStudentPageModule { }
