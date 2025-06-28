import { TestBed } from '@angular/core/testing';
import { HasRoleDirective } from '../has-role.directive';
import { Store } from '@ngrx/store';
import { ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';

describe('HasRoleDirective', () => {
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    TestBed.configureTestingModule({
      providers: [
        HasRoleDirective,
        { provide: Store, useValue: mockStore },
        { provide: ElementRef, useValue: new ElementRef(null) },
        { provide: TemplateRef },
        ViewContainerRef
      ],
    });
  });

  it('should create an instance', () => {
    const directive = TestBed.inject(HasRoleDirective);
    expect(directive).toBeTruthy();
  });
});
