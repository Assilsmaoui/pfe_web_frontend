import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityDetailComponent } from './user-activity-detail.component';

describe('UserActivityDetailComponent', () => {
  let component: UserActivityDetailComponent;
  let fixture: ComponentFixture<UserActivityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserActivityDetailComponent]
    });
    fixture = TestBed.createComponent(UserActivityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
