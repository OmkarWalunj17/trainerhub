import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostmanLoader } from './postman-loader';

describe('PostmanLoader', () => {
  let component: PostmanLoader;
  let fixture: ComponentFixture<PostmanLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostmanLoader],
    }).compileComponents();

    fixture = TestBed.createComponent(PostmanLoader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
