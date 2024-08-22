import { TestBed } from '@angular/core/testing';

import { MoeServiceService } from './moe-service.service';

describe('MoeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoeServiceService = TestBed.get(MoeServiceService);
    expect(service).toBeTruthy();
  });
});
