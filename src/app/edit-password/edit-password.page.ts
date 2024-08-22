import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../services/common-services/common.service';
import { Storage } from '@ionic/storage-angular';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../services/auth-services/auth.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
})
export class EditPasswordPage implements OnInit {
  error = '';
  PasswordForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public commonService: CommonService, public storage: Storage,
    public authService: AuthService) {
    this.PasswordForm = formBuilder.group({
      old_password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      re_password: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
  }

  submitPasswordForm() {
    this.error = '';
    if (!this.PasswordForm.valid) { return this.error = 'Please fill in the form correctly!'; }
    if (this.PasswordForm.value.new_password !== this.PasswordForm.value.re_password) { return this.error = 'Passwords did not match'; }
    this.commonService.loaderPreset('Updating Password');
    this.commonService.generalEdit(this.PasswordForm.value, 'users/me/change-password').subscribe(res => {
      this.commonService.loaderDismiss();
      this.storageChangeOfflineCredentials(this.PasswordForm.value.new_password);
      this.commonService.generalAlert('SUCCESS', 'Password successfully changed!');
      this.PasswordForm.reset();
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.status === 0) { return this.error = 'You can not change password when offline!'; }
        if (error.error.detail) { return this.error = error.error.detail; }
        console.log(error);
      });
  }

  async storageChangeOfflineCredentials(pass) {
    await this.storage.get('current_user').then(async decrypteduser => {
      const bytes = CryptoJS.AES.decrypt(decrypteduser, this.authService.secretKey);
      const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      user.password = pass;
      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), this.authService.secretKey).toString();
      this.storage.set('current_user', encryptedUser);
    });
  }
}
