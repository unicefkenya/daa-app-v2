import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsPipe } from './students-pipe/students.pipe';

@NgModule({
  declarations: [StudentsPipe],
  imports: [
    CommonModule
  ],
  exports: [StudentsPipe]
})
export class PipesModule { }
