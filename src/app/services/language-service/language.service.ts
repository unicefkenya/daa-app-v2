import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLag: any;

  constructor(public translate: TranslateService, public storage: Storage, public alertController: AlertController, ) { }

  defaultLanguage() {
    this.storage.get('current_lang').then(lag => {
      if (lag) {
        this.translate.setDefaultLang(lag);
        this.currentLag = lag;
      } else {
        this.translate.setDefaultLang('en');
        this.currentLag = 'en';
      }
    });
  }

  async changeLanguage() {
    const checkBoxInput: Array<any> = [
      { name: 'English', type: 'radio', label: 'English', value: 'en', checked: false },
      { name: 'Somali', type: 'radio', label: 'Somali', value: 'som', checked: false }
    ];
    checkBoxInput.map(data => {
      if (data.value === this.currentLag) { data.checked = true; }
      return data;
    });
    let cancel;
    let okay;
    let header;
    await this.translate.get('Okay').subscribe(value => okay = value);
    await this.translate.get('Cancel').subscribe(value => cancel = value);
    await this.translate.get('Select Language').subscribe(value => header = value);
    const alert = await this.alertController.create({
      header: 'Select Language / Dooro Luuqad',
      inputs: checkBoxInput,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          cssClass: 'move-students-class',
          handler: () => {
          }
        },
        {
          text: okay,
          handler: lag => {
            if (this.currentLag === 'lag') { return; }
            if (lag) {
              this.translate.use(lag);
              this.storage.set('current_lang', lag);
              this.currentLag = lag;
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
