import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservablespractiseComponent } from './observablespractise.component';

describe('ObservablespractiseComponent', () => {
  let component: ObservablespractiseComponent;
  let fixture: ComponentFixture<ObservablespractiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservablespractiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservablespractiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
