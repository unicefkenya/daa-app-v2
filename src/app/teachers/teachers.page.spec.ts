import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeachersPage } from './teachers.page';
import { TeachersPipePipe } from '../pipes/teachers-pipe/teachers.pipe';

import { CommonService } from '../services/common-services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeachersPage', () => {
  let component: TeachersPage;
  let fixture: ComponentFixture<TeachersPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [

        HttpClientModule,
        RouterTestingModule,
        IonicModule
      ],
      providers: [
        CommonService,
      ],
      declarations: [TeachersPipePipe, TeachersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
