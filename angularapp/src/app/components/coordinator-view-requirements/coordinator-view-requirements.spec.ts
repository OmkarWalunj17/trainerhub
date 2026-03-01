import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorViewRequirements } from './coordinator-view-requirements';

describe('CoordinatorViewRequirements', () => {
  let component: CoordinatorViewRequirements;
  let fixture: ComponentFixture<CoordinatorViewRequirements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorViewRequirements],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinatorViewRequirements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
