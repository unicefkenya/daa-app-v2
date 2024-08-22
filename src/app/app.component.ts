import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkService } from './services/network-status/network.service';
import { timer } from 'rxjs';
import { LanguageService } from './services/language-service/language.service';
import { Chart } from 'chart.js'
import { Storage } from '@ionic/storage-angular';
import * as mixpanel from 'mixpanel-browser';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  showSplash = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private networkService: NetworkService,
    private languageService: LanguageService,
    private storage: Storage
  ) {
    Chart.defaults.global.defulatFontFamily = 'Prompt-Medium';
    this.initializeApp();
  }
  ngOnInit() {
    this.storage.create();
    mixpanel.init('8ceb9780b6a2f4b40b3f4794e112f7de', { debug: false, ignore_dnt: true, track_pageview: false });
    const trackRoute = (route: any) => {
      mixpanel.track('Route Visited', {
        route: route,
      });
    };
    if (environment.production) {
    trackRoute(window.location.pathname);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log(`The platform is ready..`)
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.networkService.syncAttendanceData();
      this.networkService.syncStudentsData();
      this.networkService.connection();
      this.networkService.disConnection();
      timer(3000).subscribe(() => this.showSplash = false)
      this.languageService.defaultLanguage();
      console.log(this.networkService.connectionTypes)
      console.log(this.networkService.networkType)
    });

  }
}
