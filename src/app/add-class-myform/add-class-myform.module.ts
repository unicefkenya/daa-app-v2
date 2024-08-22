import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { MyformModule } from 'src/app/shared/myform/myform.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddClassMyformComponent } from './add-class-myform.component';

const routes: Routes = [
  {
    path: '',
    component: AddClassMyformComponent
  }
];

@NgModule({
  declarations: [AddClassMyformComponent],
  imports: [
    CommonModule,
    FormsModule,
    MyformModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class AddClassMyformModule { }
