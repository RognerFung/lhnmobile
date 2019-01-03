import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../_shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

    tokenKey: string = 'JWT';
    token: string = undefined;
    httpOptions: any;

    constructor(
        private http: Http,
        private httpC: HttpClient,
    ) { }

    getItem(path) {
        this.useCredentials();
        return this.httpC.get(baseURL + path, this.httpOptions).pipe(
            map((response: Response) => response.json()),
            catchError(error => this.handleError(error))
        );
    }

    get(path) {
        this.useCredentials();
        return this.http.get(baseURL + path, this.httpOptions).pipe(
            map((response: Response) => response.json()),
            catchError(error => this.handleError(error))
        );
    }

    post(path, body) {
        this.useCredentials();
        return this.http.post(baseURL + path, body, this.httpOptions).pipe(
            map((response: Response) => response.json()),
            catchError(error => this.handleError(error))
        );
    }

    storeCredentials(credentials: any) { 
        localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    }

    useCredentials() {
        let credentials = JSON.parse(localStorage.getItem(this.tokenKey));
        if (credentials && credentials.token != undefined) {
            this.token = credentials.token;
            this.httpOptions = {
                headers: new Headers({
                    'Content-Type':  'application/json',
                    'Authorization': 'bearer ' + this.token
                })
            };
        } else {
            this.httpOptions = {
                headers: new Headers({
                    'Content-Type':  'application/json'
                })
            }
        } 
    }

    useCredentialsForFile() {
        let credentials = JSON.parse(localStorage.getItem(this.tokenKey));
        if (credentials && credentials.token != undefined) {
            //console.log("useCredentials ", credentials);
            this.token = credentials.token;
            this.httpOptions = {
                headers: new Headers({
                    'Authorization': 'bearer ' + this.token
                })
            };
        } else {
            this.httpOptions = {
                headers: new Headers({
                })
            }
        } 
    }

    destroyCredentials() {
        //console.log('Token destroyed');
        this.token = undefined;
        this.httpOptions = undefined;
        localStorage.removeItem(this.tokenKey);
    }

    handleError(error: HttpErrorResponse | any) {
        let errMsg: string;

        if (error.error instanceof Error) {
            errMsg = error.error.message;
        } else {
            errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
        }
        console.log(errMsg);
        return throwError(errMsg);
    }

    uploadFile (path, formData) {
        this.useCredentialsForFile();
        return this.http.post(baseURL + path, formData, this.httpOptions).pipe(
            map(res => res.json()),
            catchError(error => this.handleError(error))
        )
    }

    checkLogin () {
        return this.get('users/checkJWTToken').pipe(
            map(res => res.success),
            catchError(error => this.handleError(error))
        );
    }

}
