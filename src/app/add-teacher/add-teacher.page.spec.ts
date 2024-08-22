import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTeacherPage } from './add-teacher.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonService } from '../services/common-services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePicker } from '@ionic-native/date-picker/ngx';

describe('AddTeacherPage', () => {
  let component: AddTeacherPage;
  let fixture: ComponentFixture<AddTeacherPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddTeacherPage],
      imports: [
        FormsModule,
        ReactiveFormsModule,

        HttpClientModule,
        RouterTestingModule,
        IonicModule
      ],
      providers: [
        CommonService,
        DatePicker
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeacherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
