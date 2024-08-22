import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewStudentsPage } from './view-students.page';

import { CommonService } from '../services/common-services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { StudentsPipe } from '../pipes/students-pipe/students.pipe';
import { CallNumber } from '@ionic-native/call-number/ngx';

describe('ViewStudentsPage', () => {
  let component: ViewStudentsPage;
  let fixture: ComponentFixture<ViewStudentsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [

        HttpClientModule,
        RouterTestingModule,
        IonicModule
      ],
      providers: [
        CommonService,
        CallNumber
      ],
      declarations: [StudentsPipe, ViewStudentsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
