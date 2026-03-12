import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitesUtilisateursComponent } from './activites-utilisateurs.component';

describe('ActivitesUtilisateursComponent', () => {
  let component: ActivitesUtilisateursComponent;
  let fixture: ComponentFixture<ActivitesUtilisateursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitesUtilisateursComponent]
    });
    fixture = TestBed.createComponent(ActivitesUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
