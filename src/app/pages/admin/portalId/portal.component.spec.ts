import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SegmentationComponent } from './portal.component';

describe('SegmentationComponent', () => {
  let component: SegmentationComponent;
  let fixture: ComponentFixture<SegmentationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SegmentationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
