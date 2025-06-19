import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDashComponent } from './my-dash.component';

describe('MyDashComponent', () => {
  let component: MyDashComponent;
  let fixture: ComponentFixture<MyDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
