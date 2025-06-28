import { inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ROLES_AVAILABLE } from '@core/roles/models/constants/roles.constants';
import { FeatureFlagService } from '@modules/web/feature-flags/feature-flag.service';

@Component({
    selector: 'mdk-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    //#region [---- DEPENDENCIES ----]

    private readonly featuresFlagService:FeatureFlagService = inject(FeatureFlagService)

    //#endregion

    //#region [---- PROPERTIES ----]

    public menuItems: any[] = [];

    //#endregion

    //#region [---- LIFE CYCLES ----]

    ngOnInit() {
        this.loadAllMenuItems()
    }

    //#endregion

    //#region [---- LOGIC ----]

    private loadAllMenuItems():void{
        this.loadUsersItemsMenu()
        this.loadBankingItemsMenu()
        this.loadWebItemsMenu()
        this.loadMobileItemsMenu()
    }

    private loadUsersItemsMenu():void {
        const usersItems =   {
            label: 'Users',
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'Search Users',
                    icon: 'pi pi-fw pi-search-plus',
                    routerLink: ['/users/search-users']
                },


                {
                    label: 'Custom Codes',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/referrals/custom-codes']
                },
                {
                    label: 'Disable/enable codes',
                    icon: 'pi pi-fw pi-user-minus',
                    routerLink: ['/referrals/disable-codes']
                },
            ]
        }

        this.menuItems = [...this.menuItems,usersItems]
    }

    private loadBankingItemsMenu():void {
        const usersItems =   {
            label: 'Banking',
            icon: 'pi pi-fw pi-building-columns',
            items: [
                {
                    label: "Manage cards",
                    icon: 'pi pi-fw pi-credit-card',
                    routerLink: ['/users/manage-cards']
                },
                {
                    label: 'Transfer to Modak',
                    icon: 'pi pi-arrow-right-arrow-left',
                    routerLink: ['/transfer']
                }
            ]
        }

        this.menuItems = [...this.menuItems,usersItems]
    }

    private loadWebItemsMenu():void {
        this.featuresFlagService.userAllowedForFeatureFlags().subscribe({
            next:(isEnabled => {
                if(isEnabled){
                    const webItems = {
                        label: 'Web App',
                        icon: '',
                        rolesAllowed: [ROLES_AVAILABLE.WEB_DEVELOPER],
                        items: [
                            {
                                label: 'Feature Flags',
                                icon: 'pi pi-fw pi-directions',
                                routerLink: ['/web/feature-flags'],
                                rolesAllowed: [ROLES_AVAILABLE.WEB_DEVELOPER],
                            },
                        ]
                    }

                    this.menuItems = [...this.menuItems,webItems]
                }
            })
        })

    }

    private loadMobileItemsMenu():void {
        const mobileItems =    {
            label: 'Mobile App',
            icon: '',
            items: [
                {
                    label: 'Invest Screen Manager',
                    icon: 'pi pi-fw pi-chart-line',
                    routerLink: ['/mobile/invest-screen']
                },
                {
                    label: 'Achievements',
                    icon: 'pi pi-fw pi-mobile',
                    routerLink: ['/mobile/achievements']
                },
                {
                    label: 'Mint by CSV',
                    icon: 'pi pi-fw pi-money-bill',
                    routerLink: ['/users/mint']
                },
            ]
        }

        this.menuItems = [...this.menuItems,mobileItems]
    }



    //#endregion
}

