import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coordinatorviewfeedback } from './coordinatorviewfeedback';

describe('Coordinatorviewfeedback', () => {
  let component: Coordinatorviewfeedback;
  let fixture: ComponentFixture<Coordinatorviewfeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coordinatorviewfeedback],
    }).compileComponents();

    fixture = TestBed.createComponent(Coordinatorviewfeedback);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
