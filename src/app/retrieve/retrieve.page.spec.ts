import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrievePage } from './retrieve.page';

describe('RetrievePage', () => {
  let component: RetrievePage;
  let fixture: ComponentFixture<RetrievePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrievePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
