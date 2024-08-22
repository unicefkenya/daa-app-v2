import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClassesPage } from './classes.page';

import { CommonService } from '../services/common-services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, NavParams, NavController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

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

describe('ClassesPage', () => {
  let component: ClassesPage;
  let fixture: ComponentFixture<ClassesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,

        HttpClientModule,
        RouterTestingModule,
      ],
      declarations: [ClassesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        CommonService,
        { provide: NavParams, useClass: NavParamsMock },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
