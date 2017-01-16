import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Component({
    moduleId: module.id.toString(),
    selector: 'resource-profile',
    templateUrl: 'resourceProfile.component.html',
    styleUrls: ['resourceProfile.component.css'],
    inputs: [
        'resourceId'
    ]

})
export class ResourceProfileComponent implements OnDestroy, OnInit {

    title: string;

    _resourceId: number;

    set resourceId(v: number) {
        this._resourceId = v;
        //if (this.ready) {
        //    this.refresh();
        //}
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}