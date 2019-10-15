import { KinshipsService } from './kinships.service';
import { TestBed, async, inject } from '@angular/core/testing';


describe('Service: Kinships', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KinshipsService]
    });
  });

  it('should ...', inject([KinshipsService], (service: KinshipsService) => {
    expect(service).toBeTruthy();
  }));
});
