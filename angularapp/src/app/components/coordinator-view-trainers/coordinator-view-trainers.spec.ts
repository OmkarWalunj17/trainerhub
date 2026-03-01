import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorViewTrainers } from './coordinator-view-trainers';

describe('CoordinatorViewTrainers', () => {
  let component: CoordinatorViewTrainers;
  let fixture: ComponentFixture<CoordinatorViewTrainers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorViewTrainers],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinatorViewTrainers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
