import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsListComponent } from './labs-list.component';

describe('LabsListComponent', () => {
  let component: LabsListComponent;
  let fixture: ComponentFixture<LabsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
