import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth/auth.guard';
import { ReactivateReasonComponent } from './reactivate-reason.component';

const routes: Routes = [
  {
    path: '',
    component: ReactivateReasonComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [ReactivateReasonComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PipesModule,
    RouterModule.forChild(routes),
  ]
})
export class ReactivateReasonModule { }
