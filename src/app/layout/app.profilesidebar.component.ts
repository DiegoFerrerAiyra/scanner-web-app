import { Component, inject, OnInit } from '@angular/core';
import { GlobalState } from '@core/global-state/app.state';
import { IUser } from '@modules/auth/models/interfaces/auth.interfaces';
import { selectUser } from '@modules/auth/state/authentication.selectors';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { LayoutService } from './service/app.layout.service';
import { ClipboardService } from 'ngx-clipboard';
import { MessageService } from 'primeng/api';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';
import { FIVE_SECONDS } from '@shared/models/constants/time.constant';

@Component({
    selector: 'mdk-profilemenu',
    templateUrl: './app.profilesidebar.component.html',
    styles: [`
        .signup-container {
            display:flex;
            align-items:center;
        }
        .elements-container{
            display:flex;
            flex-direction:column;
            row-gap: 5px;
        }
        .info-element{
            display:flex;
            column-gap:8px;
            align-items:center;
            .copy-icon{
                cursor:pointer
            }
            .copy-icon:hover{
                opacity: .5;
            }
        }
        .id-element{
            max-width:175px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .element-container{
            display:flex;
            column-gap:8px;
            align-items:center;
            h1{
                font-size:14px;
                min-width: 100px;
                text-align:center;
            }
            button{
                height:30px;
                width:30px;
            }
        }
        .roles-container{
            display:flex;
            flex-direction: column;
        }
    `]
})
export class AppProfileSidebarComponent implements OnInit {

    private readonly layoutService:LayoutService = inject(LayoutService)
    private readonly authService:AuthService = inject(AuthService)
    private readonly clipboardService:ClipboardService = inject(ClipboardService)
    private readonly store:Store<GlobalState> = inject(Store<GlobalState>)
    private messageService: MessageService = inject(MessageService)

    user$!: Observable<IUser>;

    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }

    ngOnInit(): void {
        this.user$ = this.store.select(selectUser).pipe()
    }


    copyToClipboard(value:string):void{
        this.clipboardService.copyFromContent(value);
        this.messageService.add({
            life: FIVE_SECONDS,
            severity: TOAST_SEVERITY_TYPES.SUCCESS,
            summary: 'Copy on clipboard',
            detail: value
        });
    }



    logout():void{
        this.authService.logout()
    }
}