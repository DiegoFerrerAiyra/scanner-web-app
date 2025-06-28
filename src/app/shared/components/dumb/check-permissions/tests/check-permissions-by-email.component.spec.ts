import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPermissionsByEmailComponent } from '../check-permissions-by-email.component';
import { provideMockStore } from '@ngrx/store/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { GlobalState } from '@core/global-state/app.state';

const getTestBed = (initialState: Partial<GlobalState> = {}) => {
    return TestBed.configureTestingModule({
        declarations: [CheckPermissionsByEmailComponent],
        imports: [
            CommonModule,
        ],
        providers: [
            provideMockStore({
                initialState
            }),
        ]
    }).compileComponents();
}

describe('CheckPermissionComponent', () => {
    let component: CheckPermissionsByEmailComponent;
    let fixture: ComponentFixture<CheckPermissionsByEmailComponent>;

    it('should create', async () => {
        await getTestBed()

        fixture = TestBed.createComponent(CheckPermissionsByEmailComponent);
        component = fixture.componentInstance;

        expect(component).toBeTruthy();
    });

    it('No permissions', async () => {
        const initialState: Partial<GlobalState> = {
            authentication: {
                user: {
                    name: "testing",
                    email: "testing@test.me",
                    accessToken: "token",
                    refreshToken: "refresh-token",
                    roles: [],
                },
            },
        }
        await getTestBed(initialState)

        fixture = TestBed.createComponent(CheckPermissionsByEmailComponent);

        component = fixture.componentInstance;
        component.emails = ["testing@test.mee"]

        const query = By.css('.no-permissions');
        const containerNoPermissionsEl: DebugElement = fixture.debugElement.query(query)
        expect(containerNoPermissionsEl?.nativeElement).toBeFalsy();
    });

    it('Has permissions', async () => {
        const initialState: Partial<GlobalState> = {
            authentication: {
                user: {
                    name: "testing",
                    email: "testing@test.me",
                    accessToken: "token",
                    refreshToken: "refresh-token",
                    roles: [],
                },
            },
        }
        await getTestBed(initialState)

        fixture = TestBed.createComponent(CheckPermissionsByEmailComponent);

        component = fixture.componentInstance;
        component.emails = ["testing.no.permissions@test.me"]

        fixture.detectChanges();

        const query = By.css('.no-permissions');
        const containerNoPermissionsEl: DebugElement = fixture.debugElement.query(query)
        expect(containerNoPermissionsEl?.nativeElement).toBeTruthy();
    });
});