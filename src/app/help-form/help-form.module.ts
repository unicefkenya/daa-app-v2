import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyformModule } from '../shared/myform/myform.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HelpFormComponent } from './help-form.component';

const routes: Routes = [
  {
    path: '',
    component: HelpFormComponent
  }
];

@NgModule({
  declarations: [HelpFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    MyformModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class HelpFormModule { }
