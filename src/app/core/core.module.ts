import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Environments
import { environment } from 'src/environments/environment';

// NgRx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './global-state/app.state';
import { metaReducers } from '../configs/ngrx-redux/constants/ngrx.constants';
import { RolesModule } from '@core/roles/roles.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    RolesModule
  ],
  exports: [
    StoreModule,
    StoreDevtoolsModule,
    RolesModule
  ]
})
export class CoreModule { }
