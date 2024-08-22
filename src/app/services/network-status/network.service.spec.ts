import { TestBed } from '@angular/core/testing';

import { NetworkService } from './network.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonService } from '../common-services/common.service';

import { Network } from '@ionic-native/network/ngx';

describe('NetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [

      HttpClientModule,
      RouterTestingModule,
      IonicModule
    ],
    providers: [
      Network,
      CommonService,
    ],
  }));

  it('should be created', () => {
    const service: NetworkService = TestBed.get(NetworkService);
    expect(service).toBeTruthy();
  });
});
