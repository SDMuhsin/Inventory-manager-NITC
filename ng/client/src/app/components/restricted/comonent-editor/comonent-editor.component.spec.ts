import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComonentEditorComponent } from './comonent-editor.component';

describe('ComonentEditorComponent', () => {
  let component: ComonentEditorComponent;
  let fixture: ComponentFixture<ComonentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComonentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComonentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
