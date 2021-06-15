import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CDLabComponent } from './cdlab.component';

describe('CDLabComponent', () => {
  let component: CDLabComponent;
  let fixture: ComponentFixture<CDLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CDLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CDLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
