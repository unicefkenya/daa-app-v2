import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddStudentPage } from './add-student.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonService } from '../services/common-services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePicker } from '@ionic-native/date-picker/ngx';

describe('AddStudentPage', () => {
  let component: AddStudentPage;
  let fixture: ComponentFixture<AddStudentPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,

        HttpClientModule,
        RouterTestingModule,
        IonicModule
      ],
      declarations: [AddStudentPage],
      providers: [
        CommonService,
        DatePicker
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
