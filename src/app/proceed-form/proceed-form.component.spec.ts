import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedFormComponent } from './proceed-form.component';

describe('ProceedFormComponent', () => {
  let component: ProceedFormComponent;
  let fixture: ComponentFixture<ProceedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProceedFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProceedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
