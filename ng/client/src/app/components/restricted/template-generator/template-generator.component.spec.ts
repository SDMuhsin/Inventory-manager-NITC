import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateGeneratorComponent } from './template-generator.component';

describe('TemplateGeneratorComponent', () => {
  let component: TemplateGeneratorComponent;
  let fixture: ComponentFixture<TemplateGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
