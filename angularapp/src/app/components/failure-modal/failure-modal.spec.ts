import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureModal } from './failure-modal';

describe('FailureModal', () => {
  let component: FailureModal;
  let fixture: ComponentFixture<FailureModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureModal],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
