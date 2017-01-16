import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ResourceRow } from '../../models';

@Component({
    moduleId: module.id.toString(),
    selector: 'resource-details',
    templateUrl: 'resourceDetails.component.html',
    styleUrls: ['resourceDetails.component.css'],
    inputs: [
        'resource'
    ]
})
export class ResourceDetailsComponent implements OnDestroy, OnInit {

    @Output() projectResourceViewRequested: EventEmitter<any>;

    set resource(v: any) {
        this._resource = v;
        if (this._resource) {
            this.resourceId = this._resource.Id;
            this.title = this._resource.ResourceName;
            this.visible = true;

        } else {
            this.resourceId = 0;
            this.title = '';
            this.visible = false;
        }
    }
    private _resource: ResourceRow

    resourceId: number;

    title: string;

    visible: boolean = false;

    projectViewRequested($event: any) {
        this.projectResourceViewRequested.emit($event);
    }

    constructor(
        ) {

        this.projectResourceViewRequested = new EventEmitter();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}