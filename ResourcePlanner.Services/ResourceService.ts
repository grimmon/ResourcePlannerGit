import { IResource } from './IResource';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ResourceService {
    private _resourceUrl = 'api/resource';

    constructor(private _http: Http) { }

    getProducts(): Observable<IResource[]> {
        return this._http.get(this._resourceUrl)
            .map((response: Response) => <IResource[]>response.json());
    }
}
