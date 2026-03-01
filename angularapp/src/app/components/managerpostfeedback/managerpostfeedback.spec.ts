import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Managerpostfeedback } from './managerpostfeedback';

describe('Managerpostfeedback', () => {
  let component: Managerpostfeedback;
  let fixture: ComponentFixture<Managerpostfeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Managerpostfeedback],
    }).compileComponents();

    fixture = TestBed.createComponent(Managerpostfeedback);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
