import { AuthService } from './../services/auth-services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common-services/common.service';
import { LanguageService } from '../services/language-service/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;

  constructor(public navCtrl: NavController, public storage: Storage, public router: Router, public alertController: AlertController,
    public commonService: CommonService, public languageService: LanguageService, public translateService: TranslateService) { }

  ngOnInit() {
    this.getProfile();
  }

  gotoeditpassword() {
    this.navCtrl.navigateForward('/tabs/edit-password');
  }

  gotoupdateattendance() {
    this.navCtrl.navigateForward('/tabs/update-attendance');
  }

  gotoupdatestudent() {
    this.router.navigate(['/tabs/update-attendance', { student: true }]);
  }

  gotohelp() {
    this.navCtrl.navigateForward('/tabs/help');
  }

  async changeLag() {
    this.languageService.changeLanguage();
  }

  async logout() {
    this.commonService.loaderPreset('Logging Out');
    await this.storage.remove('logged_in');
    this.commonService.loaderDismiss();
    this.router.navigateByUrl('/login');
  }

  async getProfile() {
    return await this.commonService.storageUserProfile().then(data => {
      this.user = data;
    });
  }


}
