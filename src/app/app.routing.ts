import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HasRoleGuard } from '@core/roles/has-roles.guard';
import { ROLES_AVAILABLE } from '@core/roles/models/constants/roles.constants';
import { PublicGuard } from 'src/app/core/guards/public.guard';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthenticatedGuard } from '@core/guards/authenticated.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: "",
                redirectTo: "scanner/search-stocks",
                pathMatch: "full",
              },
            // USERS
            {
                path: 'scanner/search-stocks',
                data: { breadcrumb: 'Small caps tiempo real' },
                loadChildren: () => import('./modules/scanner/scanner-small-caps/scanner.module').then(m => m.ScannerSmallCapsModule),
            },
            // WEB
            {
                path: 'web',
                canActivate: [HasRoleGuard],
                data: { allowedRoles:[ROLES_AVAILABLE.WEB_DEVELOPER] },
                loadChildren: () => import('./modules/web/web.module').then(m => m.WebModule)
            },
        ],
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
        canMatch: [PublicGuard],
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
