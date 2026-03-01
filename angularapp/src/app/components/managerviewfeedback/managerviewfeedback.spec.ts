import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Managerviewfeedback } from './managerviewfeedback';

describe('Managerviewfeedback', () => {
  let component: Managerviewfeedback;
  let fixture: ComponentFixture<Managerviewfeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Managerviewfeedback],
    }).compileComponents();

    fixture = TestBed.createComponent(Managerviewfeedback);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
