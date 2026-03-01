import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Managernav } from './managernav';

describe('Managernav', () => {
  let component: Managernav;
  let fixture: ComponentFixture<Managernav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Managernav],
    }).compileComponents();

    fixture = TestBed.createComponent(Managernav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
