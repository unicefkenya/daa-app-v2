import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbsenceReasonPage } from './absence-reason.page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { CommonService } from '../services/common-services/common.service';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StudentsPipe } from '../pipes/students-pipe/students.pipe';
import { CallNumber } from '@ionic-native/call-number/ngx';

describe('AbsenceReasonPage', () => {
  let component: AbsenceReasonPage;
  let fixture: ComponentFixture<AbsenceReasonPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        IonicModule,
      ],
      providers: [
        CommonService,
        CallNumber,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ details: '3_2' }) } }
        }
      ],
      declarations: [StudentsPipe, AbsenceReasonPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceReasonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
