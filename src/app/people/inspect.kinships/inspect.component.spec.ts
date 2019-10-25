import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectKinshipsComponent } from './inspect.component';

describe('InspectKinshipsComponent', () => {
  let component: InspectKinshipsComponent;
  let fixture: ComponentFixture<InspectKinshipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectKinshipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectKinshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
