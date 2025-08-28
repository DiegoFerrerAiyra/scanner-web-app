import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'mdk-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    //#region [---- DEPENDENCIES ----]

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
    }

    private loadUsersItemsMenu():void {
        const usersItems =   {
            label: 'Scanner',
            icon: 'pi pi-fw pi-chart-bar',
            items: [
                {
                    label: 'Micro Caps real time',
                    icon: 'pi pi-fw pi-chart-bar',
                    routerLink: ['/users/search-users']
                },
            ]
        }

        this.menuItems = [...this.menuItems,usersItems]
    }


    //#endregion
}

