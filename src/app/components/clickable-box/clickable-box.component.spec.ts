import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickableBoxComponent } from './clickable-box.component';

describe('ClickableElementComponent', () => {
  let component: ClickableBoxComponent;
  let fixture: ComponentFixture<ClickableBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClickableBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClickableBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
