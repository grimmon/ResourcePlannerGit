import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService } from '../../core';
import { ResourceRow, DetailPage, ResourceService } from '../../models';


@Component({
    moduleId: module.id,
    selector: 'resource-details',
    templateUrl: 'resourceDetails.component.html',
    styleUrls: ['resourceDetails.component.css']
})
export class ResourceDetailsComponent implements OnDestroy, OnInit {

    title: string;

    visible: boolean = false;

    resourceId: number;

    projectViewRequested($event: any) {
        this.projectResourceViewRequested.emit($event);
    }

    @Output() projectResourceViewRequested: EventEmitter<any>;

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router) {

        this.projectResourceViewRequested = new EventEmitter();

        this.messageService.onApplyRequested(filters => {
            this.resourceId = 0;
            this.title = '';
            this.visible = false;
        });

        this.messageService.onResourceSelected(resourceRow => this.selectResource(resourceRow));
    }

    ngOnInit() {
    }

    private selectResource(resource: ResourceRow) {
        this.title = resource.ResourceName;
        this.resourceId = resource.Id;
        this.visible = true;
    }

    ngOnDestroy() {
    }
}