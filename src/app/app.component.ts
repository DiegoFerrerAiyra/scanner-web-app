import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GlobalState } from '@core/global-state/app.state';
import { selectLoader } from '@core/global-state/reducers/loader/loader.selectors';
import { AuthService } from '@modules/auth/auth.service';
import { Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
    selector: 'mdk-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

    private readonly primengConfig:PrimeNGConfig = inject(PrimeNGConfig)
    private readonly store:Store<GlobalState> = inject(Store<GlobalState>)
    private readonly authService:AuthService = inject(AuthService)

    inProgress: boolean = false
    loaderSubscription!:Subscription
    ngOnInit(): void {
        this.authService.getToken()
        this.primengConfig.ripple = true;
        this.spinnerSubscription()
    }

    spinnerSubscription():void{
        this.loaderSubscription = this.store.select(selectLoader).subscribe(spinner => this.inProgress = spinner?.isLoading);
    }

    ngOnDestroy(): void {
        if(this.loaderSubscription) this.loaderSubscription?.unsubscribe()
    }

}
