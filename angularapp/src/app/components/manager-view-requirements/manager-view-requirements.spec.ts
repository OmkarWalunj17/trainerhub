import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerViewRequirements } from './manager-view-requirements';

describe('ManagerViewRequirements', () => {
  let component: ManagerViewRequirements;
  let fixture: ComponentFixture<ManagerViewRequirements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerViewRequirements],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerViewRequirements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
