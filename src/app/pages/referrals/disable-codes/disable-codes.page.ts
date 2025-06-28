import { Component, inject } from '@angular/core';
import { ErrorsManager } from '@core/errors/errors.manager';
import { DisableCodesApi } from '@modules/referrals/disable-codes/disable-codes.api';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';
import { MessageService } from 'primeng/api';

@Component({
    selector: "mdk-disable-codes",
    templateUrl: "./disable-codes.page.html",
    styleUrls: ["./styles/disable-codes.page.mobile.scss","./styles/disable-codes.page.desktop.scss"],
    providers: [DisableCodesApi]
})

export class DisableCodesComponent {

    //#region [---- [DEPENDENCIES] ----]
    private readonly disableCustomCodes: DisableCodesApi = inject(DisableCodesApi)
    private readonly messageService: MessageService = inject(MessageService)
    private readonly errorsManager: ErrorsManager = inject(ErrorsManager)
    //#endregion

    //#region [---- PROPERTIES ----]
    public inputCodeID :string
    public inputNewState :string
    private readonly enableValue :string = "enable"
    private readonly disableValue :string = "disable"
    //#endregion

    //#region [---- [REQUEST TO BACKEND ENDPOINT] ----]
    public disableCustomCode(){
        if (this.inputNewState == this.disableValue){
            this.disableCustomCodes.disableCode(this.inputCodeID).subscribe({
                next: ()=> {
                    this.messageService.add({
                        severity: TOAST_SEVERITY_TYPES.SUCCESS,
                        summary: "Successfull",
                        detail: "Code disabled succesfully",
                        life: 3000
                    })
                },
                error: (error)=> {
                    this.errorsManager.manageErrors(error)
                }
            })
        } else if (this.inputNewState == this.enableValue){
            this.disableCustomCodes.enableCode(this.inputCodeID).subscribe({
                next: ()=> {
                    this.messageService.add({
                        severity: TOAST_SEVERITY_TYPES.SUCCESS,
                        summary: "Successfull",
                        detail: "Code enabled succesfully",
                        life: 3000
                    })
                },
                error: (error)=> {
                    this.errorsManager.manageErrors(error)
                }
            })
        }
        
    }
    //#endregion

}