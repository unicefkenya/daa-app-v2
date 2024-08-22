import { AlertController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common-services/common.service';
import { AuthService } from '../services/auth-services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-promote',
  templateUrl: './promote.page.html',
  styleUrls: ['./promote.page.scss'],
})
export class PromotePage implements OnInit {
  emptyClass: boolean;
  classes: any;
  allStreams = [];
  toPromoteStreamsCount = -1;
  error = '';
  toPromote: any = [];
  promotedStreams = [];
  disableBtn = false;
  graduateClass = [];
  promotedToStreamsId = [];
  school: any;
  unDoPromotion = false;
  promotionId: any;
  completePromotion = false;
  btnLoading = false;
  checkPromotionStatus = true;
  change = false;

  constructor(public alertController: AlertController, public storage: Storage,
    public events: Events,
    public commonService: CommonService, public navCtr: NavController, public authService: AuthService,
    public activatedRoute: ActivatedRoute, public translateService: TranslateService) {

    events.subscribe('class:created', () => { this.change = true; });
    events.subscribe('class:deleted', () => { this.change = true; });
    events.subscribe('student:created', () => { this.change = true; });
    events.subscribe('class:edited', () => { this.change = true; });


  }

  ngOnInit() {
    this.storageGetClasses();
    this.activatedRoute.queryParams
      .subscribe(() => {
        if (this.change) {
          this.storageGetClasses();
          this.change = false;
        }
      });
  }

  async promoteStudentsAlert(stream, i) {
    this.error = '';
    const index = i;
    const checkData = [];
    if (stream.promote_to > 8) {
      this.graduateClass = this.allStreams[index].students;
      return;
    }
    const checkBoxInput = this.classes.filter(data => data.base_class == stream.promote_to).map(data => {
      const className = `${data.base_class}${data.name}`;
      const isChecked = this.promotedToStreamsId.includes(`${stream.id}_${data.id}`) ? true : false;
      const toReturn = { name: className, type: 'radio', label: className, value: data.id, checked: isChecked };
      checkData.push(toReturn);
      return toReturn;
    });

    if (checkBoxInput.length < 1) {
      this.commonService.generalAlert('Error', `Class ${stream.promote_to} not found. Create the class first.`);
      return;
    }
    let header;
    let cancel;
    let okay;
    await this.translateService.get('Promote to').subscribe(value => header = value);
    await this.translateService.get('Cancel').subscribe(value => cancel = value);
    await this.translateService.get('Okay').subscribe(value => okay = value);
    const alert = await this.alertController.create({
      header,
      inputs: checkBoxInput,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: okay,
          handler: selectedId => {
            if (selectedId === undefined) {
              this.promoteStudentsAlert(stream, index);
              return;
              // this.error = 'You must select the class a class to promote learners!'; return;
            }
            this.classes.map(data => {
              if (data.id === selectedId) {
                this.allStreams[index].promote_to_name = `${data.base_class}${data.name}`;
              }
            });
            if (this.promotedStreams.includes(stream.id)) {
              this.toPromote = this.toPromote.map(data => {
                if (data.prev_class === stream.id) { data.next_class = selectedId; }
                return data;
              });
            } else {
              this.toPromote.push({ prev_class: stream.id, next_class: selectedId });
              console.log(this.toPromote)

              this.promotedStreams.push(stream.id);
            }

            if (checkBoxInput.length > 1) {
              checkData.map(res => {
                if (res.checked) {
                  const id = `${stream.id}_${res.value}`;
                  this.promotedToStreamsId.splice(this.promotedToStreamsId.indexOf(id), 1);
                }
              });
            }

            if (!this.promotedToStreamsId.includes(selectedId)) { this.promotedToStreamsId.push(`${stream.id}_${selectedId}`); }
          }
        }
      ]
    });

    await alert.present();
  }


  promoteSchoool() {
    const dataToSend = {
      stream_promotions: this.toPromote,
      school: this.school,
      year: new Date().getFullYear() + 1
    };
    this.commonService.loaderPreset('Updating Promotion');
    this.commonService.generalPost(dataToSend, 'promotions').subscribe(res => {
      this.commonService.loaderDismiss();
      this.storage.set('promotion', { id: res.id, completed: res.completed });
      this.promotionId = res.id;
      this.completePromotion = true;
      this.apiCompletePromotion();
    },
      error => {
        this.commonService.loaderDismiss();
        console.log(error.error.non_field_errors)
        if (error.error.non_field_errors[0] === 'Promotions already done for this school.') {
          return this.commonService.generalAlert('ERROR', `A class can only be promoted once a year`);
        }
        if (error.status === 0) {
          return this.commonService.generalAlert('OFFLINE', `You can't perform this operation offline`);
        }
        this.commonService.generalAlert('ERROR', 'An Error Occured. Please Try Again Later');
      });
  }

  apiCompletePromotion() {
    this.btnLoading = true;
    const data = { action: 'complete' };
    const url = `promotions/${this.promotionId}/complete`;
    this.commonService.generalPost(data, url).subscribe(res => {
      this.btnLoading = false;
      this.completePromotion = false;
      this.unDoPromotion = true;
      this.apiUpdateStorage();
    },
      error => {
        this.btnLoading = false;
        this.completePromotion = true;
        this.commonService.generalAlert('Error', 'An error occured please try again later.');
        console.log(error);
      });
  }

  apiUpdateStorage() {
    this.authService.getSchoolInfo().subscribe(dt => {
      this.commonService.generalAlert('SUCCESS', 'Update successful');
      this.checkPromotionStatus = false;
      this.storageGetClasses();
    });
  }

  reversePromotion() {
    this.commonService.loaderPreset('Reversing');
    const data = { action: 'undo' };
    const url = `promotions/${this.promotionId}/complete`;
    this.commonService.generalPost(data, url).subscribe(res => {
      this.commonService.loaderDismiss();
      this.unDoPromotion = false;
      this.completePromotion = false;
      this.apiUpdateStorage();
    },
      error => {
        this.commonService.loaderDismiss();
        console.log(error);
        if (error.status === 0) {
          return this.commonService.generalAlert('OFFLINE', `You can't perform this operation offline`);
        }
        this.commonService.generalAlert('ERROR', `An Error Occured. Please Try Again Later`);
      });
  }

  apiCheckPromotionStatus(id) {
    this.commonService.loaderPreset('Loading');
    const year = new Date().getFullYear() + 1;
    const url = `promotions/?school=${id}&year=${year}`;
    this.commonService.generalFilter(url).subscribe(res => {
      this.commonService.loaderDismiss();
      if (res.results[0] === undefined) { return; }
      if (res.results[0].stream_promotions) {
        if (res.results[0].stream_promotions[0].completed) { this.unDoPromotion = true; } else {
          this.completePromotion = true;
        }
        this.promotionId = res.results[0].id;
      }
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.status === 0) { return this.commonService.generalAlert('OFFLINE', `You can't perform this operation offline`); }
        this.commonService.generalAlert('ERROR', 'The promotion satus could not be detemined');
      });
  }

  async storageGetClasses() {
    return await this.storage.get('classes').then(async res => {
      if (res) {
        this.allStreams = [];
        this.promotedStreams = [];
        if (res.length < 1) { return this.emptyClass = true; }
        this.classes = res;
        this.school = res[0].school;
        if (this.checkPromotionStatus) { this.apiCheckPromotionStatus(res[0].school); }
        await Promise.all(res.map(async classes => {
          return await this.storage.get(`stream_${classes.id}`).then(stream => {
            if (stream) {
              stream.promote_to_name = '';
              stream.population = stream.students.length;
              stream.promote_to = Number(stream.base_class) + 1;
              if (stream.population > 0) { this.allStreams.push(stream); }
            } else { return null; }
            this.toPromoteStreamsCount = this.allStreams.filter(cl => cl.base_class != "8").length
            return this.allStreams;
          });
        }));

      } else {
        this.emptyClass = true;
      }
    });
  }
}
