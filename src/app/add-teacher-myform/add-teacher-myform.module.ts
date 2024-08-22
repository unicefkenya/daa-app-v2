import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTeacherMyformComponent } from './add-teacher-myform.component'
import { from } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MyformModule } from '../shared/myform/myform.module';
const routes: Routes = [
  {
    path: '',
    component: AddTeacherMyformComponent
  }
];

@NgModule({

  declarations: [AddTeacherMyformComponent],
  imports: [
    CommonModule,
    FormsModule,
    MyformModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class AddTeacherMyformModule { }
