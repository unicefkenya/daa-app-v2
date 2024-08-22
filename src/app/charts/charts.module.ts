import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PiechartComponent } from './piechart/piechart.component';
import { BarComponent } from './bar/bar.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [PiechartComponent, BarComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [PiechartComponent, BarComponent]
})
export class ChartsModule { }
