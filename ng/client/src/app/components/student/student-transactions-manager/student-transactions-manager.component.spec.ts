import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTransactionsManagerComponent } from './student-transactions-manager.component';

describe('StudentTransactionsManagerComponent', () => {
  let component: StudentTransactionsManagerComponent;
  let fixture: ComponentFixture<StudentTransactionsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentTransactionsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTransactionsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
