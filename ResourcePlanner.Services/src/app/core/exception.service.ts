import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MessageService } from './message.service';

@Injectable()
export class ExceptionService {
    constructor(
    private messageService: MessageService) { }

    catchBadResponse: (errorResponse: any) => Observable<any> = (errorResponse: any) => {
        let res = <Response>errorResponse;
        let err = res.json();
        let emsg = err ?
            (err.error ? err.error : (err.Message ? err.Message : JSON.stringify(err))) :
            (res.statusText || 'unknown error');
        this.messageService.errorRequest({
            title: 'Exception',
            message: emsg
        })

        return Observable.of(false);
    }
}