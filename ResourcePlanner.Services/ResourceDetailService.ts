import { IResourceDetail } from './IResourceDetail';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ResourceDetailService {
    private _resourceUrl = 'api/resourcedetail';
    
    constructor(private _http: Http) { }

    getProducts(): Observable<IResourceDetail[]> {
        return this._http.get(this._resourceUrl)
            .map((response: Response) => <IResourceDetail[]>response.json());
    }
}
