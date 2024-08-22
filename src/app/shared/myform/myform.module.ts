import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyformComponent } from './myform.component';
import { MyinputComponent } from './myinput/myinput.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
//import { ModalsModule } from '../modals/modals.module';
import { IonicModule } from '@ionic/angular';
import { AuthInterceptor } from 'src/app/authInterceptor/auth.interceptor';

@NgModule({
  declarations: [
    MyformComponent,
    MyinputComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    //  ModalsModule,
    HttpClientModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    MyformComponent,
    MyinputComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class MyformModule { }
