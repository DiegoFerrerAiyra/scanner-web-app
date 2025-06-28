import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesFlagsComponent } from '../features-flags.page';

xdescribe('FeaturesFlagsComponent', () => {
  let component: FeaturesFlagsComponent;
  let fixture: ComponentFixture<FeaturesFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeaturesFlagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturesFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
