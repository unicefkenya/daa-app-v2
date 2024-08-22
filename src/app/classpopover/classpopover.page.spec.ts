import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClasspopoverPage } from './classpopover.page';


import { CommonService } from '../services/common-services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, NavParams, NavController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

class NavParamsMock {
  static returnParam = [1, 2];
  static setParams(value) {
    NavParamsMock.returnParam = [1, 2];
  }
  public get(key): any {
    if (NavParamsMock.returnParam) {
      return NavParamsMock.returnParam;
    }
    return [];
  }
}

describe('ClasspopoverPage', () => {
  let component: ClasspopoverPage;
  let fixture: ComponentFixture<ClasspopoverPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,

        HttpClientModule,
        RouterTestingModule,
      ],
      declarations: [ClasspopoverPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        CommonService,
        { provide: NavParams, useClass: NavParamsMock },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasspopoverPage);
    component = fixture.componentInstance;
    component.classes = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
