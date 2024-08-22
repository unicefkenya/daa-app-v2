import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-services/auth.service';
import { CommonService } from '../services/common-services/common.service';
import { Router } from '@angular/router';
import { AttendanceService } from '../services/attendance-service/attendance.service';
import * as CryptoJS from 'crypto-js';
import { LoadingController } from '@ionic/angular';
import { LanguageService } from '../services/language-service/language.service';
import mixpanel from 'mixpanel-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  LoginForm: FormGroup;
  formError: string;


  constructor(private storage: Storage,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public commonService: CommonService,
    public router: Router,
    public attentanceService: AttendanceService,
    public languageService: LanguageService) {
    this.LoginForm = formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    // this.storage.clear()
  }

  login() {
    this.formError = '';
    this.LoginForm.get('username').setValue(this.LoginForm.value.username.trim());
    // if (!this.LoginForm.valid) { this.formError = 'Please fill in all the fields'; return; }
    const user = this.LoginForm.value.username;
    const pass = this.LoginForm.value.password;
    const clientId = this.commonService.clientId;
    const body = `username=${user}&password=${pass}&grant_type=${'password'}&client_id=${clientId}`;
    this.commonService.loaderPreset('Authenticating');
    this.authService.login(body, this.LoginForm.value).subscribe(() => {
      this.commonService.loaderDismiss();
      this.LoginForm.reset();
      this.router.navigateByUrl('tabs/attendance');
      if (environment.production) {
        mixpanel.identify(user);
        mixpanel.people.set({
          '$username': user,
          '$last_login': new Date(),
        })
      }
    },
      error => {
        console.log(error)
        this.commonService.loaderDismiss();
        if (error === 'DOMException') { return this.formError = 'No enough space'; }
        if (error.error.error === 'invalid_grant') { return this.formError = `Username and Password didn't match`; }
        if (error.status === 0) { return this.logInUserOffline(); }
      });
  }

  async logInUserOffline() {
    await this.storage.get('current_user').then(async decrypteduser => {
      if (decrypteduser) {
        const bytes = CryptoJS.AES.decrypt(decrypteduser, this.authService.secretKey);
        const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (user) {
          if (user.username.trim() === this.LoginForm.value.username.trim() && user.password === this.LoginForm.value.password.trim()) {
            // this.attendance();
            this.storage.set('logged_in', true);
            this.LoginForm.reset();
            this.router.navigateByUrl('tabs/attendance');
          } else {
            // tslint:disable-next-line:max-line-length
            user.username.trim() !== this.LoginForm.value.username.trim() ? this.formError = `Only ${user.username} can log in Offline` :
              this.formError = `Offline credentials did not match`;
          }
        } else {
          this.formError = `No offline credential available. You can only login when you are online.`;
        }
      } else { this.formError = `No offline credential available. You can only login when you are online.`; }
    });
  }

  async gettoken() {
    await this.storage.get('user_token').then(data => {
      console.log(data);
    });
  }

  changeLag() {
    this.languageService.changeLanguage();
  }

  gotoForgotPassword() {
    this.router.navigateByUrl('forgot-password');
  }

}
