import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRequirement } from './manager-requirement';

describe('ManagerRequirement', () => {
  let component: ManagerRequirement;
  let fixture: ComponentFixture<ManagerRequirement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerRequirement],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerRequirement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
