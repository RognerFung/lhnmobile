import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnetsPage } from './enets.page';

describe('EnetsPage', () => {
  let component: EnetsPage;
  let fixture: ComponentFixture<EnetsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnetsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
