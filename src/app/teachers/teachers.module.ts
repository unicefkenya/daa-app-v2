import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TeachersPage } from './teachers.page';
import { TeachersPipePipe } from '../pipes/teachers-pipe/teachers.pipe';
import { AuthGuard } from '../guard/auth/auth.guard';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: TeachersPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [TeachersPage, TeachersPipePipe]
})
export class TeachersPageModule { }
