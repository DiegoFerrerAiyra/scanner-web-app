import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from 'src/app/core/roles/has-role.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ManageRolesComponent } from '@pages/manage-roles/manage-roles.page';
import { SharedModule } from '@shared/shared.module';
import { ComponentsModule } from '@shared/components/components.module';

xdescribe('ManageRolesComponent', () => {
  let component: ManageRolesComponent;
  let fixture: ComponentFixture<ManageRolesComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    await TestBed.configureTestingModule({
      declarations: [HasRoleDirective],
      providers: [
        { provide: Store, useValue: mockStore }
      ],
      imports: [CommonModule, ManageRolesComponent, SharedModule, ComponentsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
