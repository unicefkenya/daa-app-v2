import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { DeactivatedLearnersComponent } from './deactivated-learners.component';
import { AuthGuard } from '../guard/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DeactivatedLearnersComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [DeactivatedLearnersComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PipesModule,
    RouterModule.forChild(routes),
  ]
})
export class DeactivatedLearnersModule { }
