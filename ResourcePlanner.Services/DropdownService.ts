import { IDropdownValue } from './IDropdownValue';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DropdownService {
    private _resourceUrl = 'api/resourcedetail';

    constructor(private _http: Http) { }

    getProducts(): Observable<IDropdownValue[]> {
        return this._http.get(this._resourceUrl)
            .map((response: Response) => <IDropdownValue[]>response.json());
    }
}
