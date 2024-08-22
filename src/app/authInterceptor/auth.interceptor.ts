import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler,
    HttpRequest, HttpErrorResponse, HttpClient
} from '@angular/common/http';
import { Observable, BehaviorSubject, of, from, } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import * as moment from 'moment';
import { mergeMap } from 'rxjs/operators';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    refreshTokenError = false;

    constructor(public http: HttpClient, private storage: Storage) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.addAuthenticationToken(req)).pipe(mergeMap(request => next.handle(request)));
    }

    private addAuthenticationToken(request: HttpRequest<any>): Promise<any> {
        // If we do not have a token yet then we should not set the header.
        // Here we could first retrieve the token from where we store it.
        // return this.storage.get('user_token').then(token => {

        return new Promise((resolve, reject) => {
            if (request.url.includes('/o/')) {
                resolve(request);
            } else {
                this.storage.get('user_token').then(token => {
                    // if expired fetch a new token
                    if (token) {
                        resolve(request.clone({
                            setHeaders: {
                                Authorization: 'Bearer ' + token.access_token,
                                'Content-Type': 'application/json',
                            }
                        }));
                    } else {
                        resolve(request);
                    }
                });
            }

        });



    }
}
// add this lines to app.module.ts providers
// !important

// {
//     provide: HTTP_INTERCEPTORS,
//         useClass: AuthInterceptor,
//             multi: true
// }

