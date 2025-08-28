import { Directive, inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Roles } from '@core/roles/models/types/roles.types';
import { AuthState } from '@modules/auth/state/auth.state';

import { selectRoles } from '@modules/auth/state/authentication.selectors';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnDestroy {

  //#region [---- DEPENDENCIES ----]

  private templateRef:TemplateRef<any> = inject(TemplateRef<any>)
  private viewContainer:ViewContainerRef = inject(ViewContainerRef)
  private store:Store<AuthState> = inject(Store<AuthState>)

  //#endregion

  //#region [---- PROPERTIES ----]

  private destroy$ = new Subject<void>();
  private hasView = false;

  //#endregion

  //#region [---- LIFE CYCLES ----]

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //#endregion

  //#region [---- LOGIC ----]

  @Input() set hasRole(roles: Roles[]) {
    this.store.select(selectRoles).pipe(
      takeUntil(this.destroy$)
      ).subscribe(userRoles => {

        if(this.hasView) return

        const showView = roles.some(role => userRoles.includes(role));

        if (showView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
            return
        }
        this.viewContainer.clear();
        this.hasView = false;
      });
  }
  //#endregion
}
