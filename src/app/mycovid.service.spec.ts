import { TestBed } from '@angular/core/testing';

import { MycovidService } from './mycovid.service';

describe('MycovidService', () => {
  let service: MycovidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MycovidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
