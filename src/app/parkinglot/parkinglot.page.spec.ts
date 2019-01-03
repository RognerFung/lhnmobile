import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkinglotPage } from './parkinglot.page';

describe('ParkinglotPage', () => {
  let component: ParkinglotPage;
  let fixture: ComponentFixture<ParkinglotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkinglotPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkinglotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
