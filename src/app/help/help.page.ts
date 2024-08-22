import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common-services/common.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  public help: any = [];
  response = false;

  constructor(public commonService: CommonService, private iab: InAppBrowser, public storage: Storage, public router: Router) { }


  ngOnInit() {
    this.storageGetHelpContent();
  }

  manualBrowser() {
    const browser = this.iab.create('https://sisitech.github.io/OnekanaDocs', "_blank");
    // browser.close();
  }

  contactUs() {
    this.router.navigateByUrl('help-form');
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.help.map(async listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        await listItem
        return listItem;
      });
    }
  }

  apiGetHelpContent() {
    this.commonService.loaderPreset('Loading');
    this.commonService.generalGet('support-questions').subscribe(res => {
      this.response = true;
      this.commonService.loaderDismiss();
      if (res.results.length < 1) {
        this.commonService.generalAlert('No help Contact', 'Request your administrator to add full help content');
      }
      this.help = res.results.map(result => {
        result.expanded = true;
        result.title = result.title.trim();
        result.description = result.description.trim();
        return result;
      });
      this.storage.set('help_content', this.help);
    },
      error => {
        this.response = true;
        this.commonService.loaderDismiss();
        if (error.status === 0) { return this.commonService.generalAlert('OFFLINE', 'To get full help content you must be online.'); }
        // tslint:disable-next-line:max-line-length
        return this.commonService.generalAlert('ERROR', 'Experiencing technical problems please try again after some time for full help content');
      });
  }


  storageGetHelpContent() {
    this.storage.get('help_content').then(data => {
      if (data) {
        this.help = data;
        this.response = true;
      } else {
        this.apiGetHelpContent();
      }
    });
  }
}
