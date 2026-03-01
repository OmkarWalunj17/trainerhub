import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Selectedtrainers } from './selectedtrainers';

describe('Selectedtrainers', () => {
  let component: Selectedtrainers;
  let fixture: ComponentFixture<Selectedtrainers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Selectedtrainers],
    }).compileComponents();

    fixture = TestBed.createComponent(Selectedtrainers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
