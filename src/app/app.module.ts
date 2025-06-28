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
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { firebaseFactory } from '@core/firebase/firebase.factory';
import { FirebaseService } from '@core/firebase/firebase.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { WafProtectionService } from '@core/services/waf-protection/waf-protection.service';
import { initializeWaf } from '@core/services/waf-protection/waf-protection.factory';
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
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
    ],
    bootstrap: [AppComponent],
    providers:[
        {
            provide: APP_INITIALIZER,
            useFactory:firebaseFactory,
            deps: [FirebaseService],
            multi:true
        },
        MessageService,
        CookieService,
        {
            provide:HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi:true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeWaf,
            deps: [WafProtectionService],
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true
        }
    ]
})
export class AppModule {}
