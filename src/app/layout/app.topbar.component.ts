import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';
import { LayoutService,ColorScheme } from 'src/app/layout/service/app.layout.service';



@Component({
    selector: 'mdk-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls:  ['./app.topbar.component.scss'],
})
export class AppTopbarComponent implements OnInit {

    darkMode:boolean = false

    @ViewChild('menubutton') menuButton!: ElementRef;

    constructor(public layoutService: LayoutService) { }

    get colorScheme(): ColorScheme {
        return this.layoutService.config.colorScheme;
    }

    set colorScheme(_val: ColorScheme) {
        this.changeColorScheme(_val);
    }

    ngOnInit(): void {
        const savedTheme = localStorage.getItem('saveTheme') as ColorScheme;
        if(savedTheme) {
            this.colorScheme = savedTheme
            this.darkMode = savedTheme === 'dark'
        }
    }

    changeTheme(event:InputSwitchOnChangeEvent):void{
        this.colorScheme = event.checked ? 'dark' : 'light'
        localStorage.setItem('saveTheme',event.checked ? 'dark' : 'light')
    }

    changeColorScheme(colorScheme: ColorScheme) {
        const themeLink = <HTMLLinkElement>document.getElementById('theme-link');
        const themeLinkHref = themeLink.getAttribute('href');
        const currentColorScheme = 'theme-' + this.layoutService.config.colorScheme;
        const newColorScheme = 'theme-' + colorScheme;
        const newHref = themeLinkHref!.replace(currentColorScheme, newColorScheme);
        this.replaceThemeLink(newHref, () => {
            this.layoutService.config.colorScheme = colorScheme;
            this.layoutService.onConfigUpdate();
        });
    }

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-link';
        const themeLink = <HTMLLinkElement>document.getElementById(id);
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
            onComplete();
        });
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onProfileButtonClick() {
        this.layoutService.showProfileSidebar();
    }
    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }


    
}