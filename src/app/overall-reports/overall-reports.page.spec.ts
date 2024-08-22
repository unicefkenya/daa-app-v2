import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OverallReportsPage } from './overall-reports.page';
import { CommonService } from '../services/common-services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, NavParams } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';

class NavParamsMock {
  static returnParam = null;
  static setParams(value) {
    NavParamsMock.returnParam = value;
  }
  public get(key): any {
    if (NavParamsMock.returnParam) {
      return NavParamsMock.returnParam;
    }
    return 'default';
  }
}

describe('OverallReportsPage', () => {
  let component: OverallReportsPage;
  let fixture: ComponentFixture<OverallReportsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,

        IonicModule,
      ],
      providers: [
        CallNumber,
        DatePicker,
        CommonService,
        { provide: NavParams, useClass: NavParamsMock },
      ],
      declarations: [OverallReportsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
