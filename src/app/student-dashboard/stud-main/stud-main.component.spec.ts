import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudMainComponent } from './stud-main.component';

describe('StudMainComponent', () => {
  let component: StudMainComponent;
  let fixture: ComponentFixture<StudMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
