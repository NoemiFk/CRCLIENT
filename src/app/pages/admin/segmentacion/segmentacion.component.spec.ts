import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SegmentacionComponent } from './segmentacion.component';

describe('SegmentacionComponent', () => {
  let component: SegmentacionComponent;
  let fixture: ComponentFixture<SegmentacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SegmentacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
