import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ExceptionService, SpinnerService } from '../core';

@Injectable()
export class ServerService {

    export(url: string) {
        this.showProcess(true);
        var headers = this.getAuth();
        headers.append('Content-type', "application/json");
        headers.append('Accept', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        var res = this.http
            .get(url, {
                headers: headers,
                responseType: ResponseContentType.ArrayBuffer,
            })
            .map(res => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Bad response status: ' + res.status);
                }
                var r: any = res;
                return r._body;
            })
            .finally(() => this.showProcess(false));
        return res;
    };

    get<T>(url: string, query?: string) {
        this.showProcess(true);

        if (query) {
            url += query;
        }

        var res = this.http
            .get(url,
            {
                headers: this.getAuth()
            })
            .map(res => this.extractData<T>(res))
            .catch(this.exceptionService.catchBadResponse)
            .finally(() => this.showProcess(false));
        return res;
    }

    post<T>(url: string, entity: T) {
        let body = JSON.stringify(entity);
        this.showProcess(true);
        return <Observable<T>>this.http
            .post(`${url}`, body, {
                headers: this.getAuth()
            })
            .map(res => this.extractData<T>(res))
            .catch(this.exceptionService.catchBadResponse)
            .finally(() => this.showProcess(false));
    }

    postQuery<T>(url: string, entity: T) {
        let query = Object.getOwnPropertyNames(entity).map(key => key + "=" + entity[key]).join('&');
        this.showProcess(true);
        return <Observable<T>>this.http
            .post(`${url}?${query}`, '', {
                headers: this.getAuth()
            })
            .map(res => this.extractData<T>(res))
            .catch(this.exceptionService.catchBadResponse)
            .finally(() => this.showProcess(false));
    }

    deleteQuery<T>(url: string, entity: T) {
        let query = Object.getOwnPropertyNames(entity).map(key => key + "=" + entity[key]).join('&');
        this.showProcess(true);
        return <Observable<T>>this.http
            .delete(`${url}?${query}`, {
                headers: this.getAuth()
            })
            .map(res => this.extractData<T>(res))
            .catch(this.exceptionService.catchBadResponse)
            .finally(() => this.showProcess(false));
    }

    delete<T>(url: string, id: any) {
        this.showProcess(true);

        return <Observable<T>>this.http
            .delete(`${url}/${id}`)
            .map(res => this.extractData<T>(res))
            .catch(this.exceptionService.catchBadResponse)
            .finally(() => this.showProcess(false));
    }

    update<T>(url: string, entity: T, id: any) {
        let body = JSON.stringify(entity);
        this.showProcess(true);

        return <Observable<T>>this.http
            .put(`${url}/${id}`, body)
            .map(res => this.extractData<T>(res))
            .catch(this.exceptionService.catchBadResponse)
            .finally(() => this.showProcess(false));
    }

    constructor(
        private http: Http,
        private exceptionService: ExceptionService) {
    }

    private getAuth() {
        var token = localStorage.getItem('id_token');
        var authHeader = new Headers();
        if (token) {
            authHeader.append('Authorization', 'Bearer ' + token);
        }
        return authHeader;
    }

    private extractData<T>(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let r: any = res;
        let body = res.json && r._body ? res.json() : null;
        return <T>(body || []);
    }

    private showProcess(show: Boolean) {
        if (show) {
            //this.spinnerService.show();
        } else {
            //this.spinnerService.hide();
        }
    }
}