import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from '@core/guards/authenticated.guard';
import { HasRoleGuard } from '@core/roles/has-roles.guard';
import { ROLES_AVAILABLE } from '@core/roles/models/constants/roles.constants';
import { PublicGuard } from 'src/app/core/guards/public.guard';
import { AppLayoutComponent } from './layout/app.layout.component';

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
                redirectTo: "users/search-users",
                pathMatch: "full",
              },
            {
                path: 'manage-roles',
                canActivate: [HasRoleGuard],
                data: { breadcrumb: 'Manage Roles', allowedRoles:[ROLES_AVAILABLE.TECH_DEVELOPER] },
                loadComponent: () => import("@pages/manage-roles/manage-roles.page").then((page) => page.ManageRolesComponent),
            },
            // USERS
            {
                path: 'users/search-users',
                data: { breadcrumb: 'Search Users' },
                loadChildren: () => import('./modules/users/search-users/users.module').then(m => m.SearchUsersModule),
            },
            {
                path: 'users/mint',
                loadChildren: () => import('./modules/users/mint/mint.module').then(m => m.MintModule),
            },
            {
                path: 'users/replace-card',
                loadChildren: () => import('./modules/users/replace-card/replace-card.module').then(m => m.ReplaceCardModule)
            },
            {
                path: 'users/delete-card',
                loadChildren: () => import('./modules/users/delete-card/delete-card.module').then(m => m.DeleteCardModule)
            },

            {
                path: 'users/manage-cards',
                loadChildren: () => import("./modules/users/manage-cards/manage-cards.module").then(m => m.ManageCardsModule)
            },
            // TRANSFER
            {
                path: 'transfer',
                loadChildren: () => import('./modules/transfers/transfer.module').then(m => m.TransfersModule),
            },
            // WEB
            {
                path: 'web',
                canActivate: [HasRoleGuard],
                data: { allowedRoles:[ROLES_AVAILABLE.WEB_DEVELOPER] },
                loadChildren: () => import('./modules/web/web.module').then(m => m.WebModule)
            },
            // MOBILE
            {
                path: 'mobile/invest-screen',
                loadChildren: () => import('./modules/mobile/invest-screen/invest-screen.module').then(m => m.InvestScreenModule)
            },
            {
                path: 'mobile/achievements',
                loadChildren: () => import('./modules/mobile/achievements/achievements.module').then(m => m.AchievementsModule)
            },
            // DISCORD
            {
                path: 'discord/rate-limits',
                loadChildren: () => import('./modules/discord/rate-limits/rate-limits.module').then(m => m.RateLimitsModule)
            },
            // REFERRALS
            {
                path: 'referrals/custom-codes',
                loadChildren: () => import('./modules/referrals/custom-codes/custom-codes.module').then(m => m.CustomCodesModule)
            },
            {
                path: 'referrals/disable-codes',
                loadChildren: () => import('./modules/referrals/disable-codes/disable-codes.module').then(m => m.DisableCodesModule)
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
