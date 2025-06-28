import { Component, inject } from '@angular/core';
import { ErrorsManager } from '@core/errors/errors.manager';
import { ReferralsApi } from '@modules/referrals/custom-codes/custom-codes.api';
import { CReferralCustomCodeRewards } from '@pages/referrals/custom-codes/models/constants/custom-code.constants';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';
import { MessageService } from 'primeng/api';

@Component({
    selector: "mdk-custom-codes",
    templateUrl: "./custom-codes.page.html",
    styleUrls: ["./styles/custom-codes.page.mobile.scss","./styles/custom-codes.page.desktop.scss"],
    providers: [ReferralsApi]
})

export class CustomCodesComponent {

    //#region [---- [DEPENDENCIES] ----]
    private readonly referralsApi: ReferralsApi = inject(ReferralsApi)
    private readonly messageService: MessageService = inject(MessageService)
    private readonly errorsManager: ErrorsManager = inject(ErrorsManager)
    //#endregion

    //#region [---- PROPERTIES ----]
    public inputCustomCode :string
    public inputRewardID:string
    public readonly rewards = CReferralCustomCodeRewards
    //#endregion

    //#region [---- [REQUEST TO BACKEND ENDPOINT] ----]
    public createCustomCode(){
        this.referralsApi.createCustomCodes({
            code: this.inputCustomCode,
            reward_id: this.inputRewardID
        }).subscribe({
            next: ()=> {
                this.messageService.add({
                    severity: TOAST_SEVERITY_TYPES.SUCCESS,
                    summary: "Successfull",
                    detail: "Custom code created successfully",
                    life: 3000
                })
            },
            error: (error)=> {
                this.errorsManager.manageErrors(error)
            }
        })
    }
    //#endregion

}