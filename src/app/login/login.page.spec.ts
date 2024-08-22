import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { LoginPage } from './login.page';
import { AuthService } from '../services/auth-services/auth.service';

import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        ReactiveFormsModule,

        HttpClientModule,
        RouterTestingModule,
        IonicModule
      ],
      providers: [
        AuthService
      ],
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // function to inject form values
  function updateForm(userEmail, userPassword) {
    component.LoginForm.controls.username.setValue(userEmail);
    component.LoginForm.controls.password.setValue(userPassword);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fill login form correctly', fakeAsync(() => {
    updateForm('0700509145', 'sdfghjksdfgh');
    expect(component.LoginForm.valid).toBeTruthy();
  }));

  it('fill username only', fakeAsync(() => {
    updateForm('0700509145', null);
    expect(component.LoginForm.valid).toBeFalsy();
  }));

  it('fill password only', fakeAsync(() => {
    updateForm(null, '0000000');
    expect(component.LoginForm.valid).toBeFalsy();
  }));

});
