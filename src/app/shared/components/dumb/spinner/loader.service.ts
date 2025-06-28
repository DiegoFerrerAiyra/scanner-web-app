import { Injectable } from '@angular/core';
import { GlobalState } from '@core/global-state/app.state';
import { loaderActions } from '@core/global-state/reducers/loader/loader.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private readonly store: Store<GlobalState>) {}

  show(){
    this.store.dispatch(loaderActions.isLoading())
  }

  hide(){
    this.store.dispatch(loaderActions.stopLoading())
  }
}