import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DBManagerComponent } from './dbmanager.component';

describe('DBManagerComponent', () => {
  let component: DBManagerComponent;
  let fixture: ComponentFixture<DBManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DBManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DBManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
