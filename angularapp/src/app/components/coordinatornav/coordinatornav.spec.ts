import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coordinatornav } from './coordinatornav';

describe('Coordinatornav', () => {
  let component: Coordinatornav;
  let fixture: ComponentFixture<Coordinatornav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coordinatornav],
    }).compileComponents();

    fixture = TestBed.createComponent(Coordinatornav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
