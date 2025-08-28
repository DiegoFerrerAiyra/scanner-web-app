import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from '@core/interceptors/loader.interceptor';
import { TokenInterceptor } from '@core/interceptors/token.interceptor';
import { SharedModule } from '@shared/shared.module';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        CoreModule,
        SharedModule,
        //provideFirebaseApp(() => initializeApp(environment.firebase)),
        // provideFirestore(() => getFirestore()),
        //AngularFireModule.initializeApp(environment.firebase),
        //AngularFireAuthModule,
    ],
    bootstrap: [AppComponent],
    providers:[
        /* 
        {
            provide: APP_INITIALIZER,
            useFactory:firebaseFactory,
            deps: [FirebaseService],
            multi:true
        },
        */
        MessageService,
        CookieService,
        {
            provide:HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi:true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true
        }
    ]
})
export class AppModule {}
