import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationSent } from './verification-sent';

describe('VerificationSent', () => {
  let component: VerificationSent;
  let fixture: ComponentFixture<VerificationSent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationSent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationSent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
