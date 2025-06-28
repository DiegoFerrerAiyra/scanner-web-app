import { Component, Input, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, iif, of, switchMap } from 'rxjs';

import { GlobalState } from '@core/global-state/app.state';
import { selectUser } from '@modules/auth/state/authentication.selectors';

@Component({
    selector: 'mdk-check-permissions-by-email',
    template: `
        <ng-container *ngIf="(hasPermissions$ | async); else noPermissions">
            <ng-content></ng-content>
        </ng-container>
        <ng-template #noPermissions>
            <div class="no-permissions">
                <h2 class="title">
                    You don't have permissions to use this functionality
                </h2>
                <p>Please check with your administrator</p>
            </div>
        </ng-template>
    `,
    styles: [`
        .no-permissions {
            text-align: center;
            width: 80%;
            margin-inline: auto;
            .title {
                font-size: 3rem;
            }
        }
    `],
})
export class CheckPermissionsByEmailComponent implements OnInit {
    private readonly store: Store<GlobalState> = inject(Store);

    @Input() public emails: string[] = [];
    public hasPermissions$: Observable<boolean>;

    ngOnInit(): void {
        this.checkPermissions()
    }

    private checkPermissions(): void {
        this.hasPermissions$ = this.store.select(selectUser).pipe(
            switchMap(usr => {
                return iif(() => this.emails.includes('*'), of(true), of(this.emails.includes(usr.email)))
            }),
        )
    }
}