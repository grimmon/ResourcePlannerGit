import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../../core';
import { Resource, ResourcePage, ResourceRow, ResourceService, TimeAggregation } from '../../../models';

@Component({
    moduleId: module.id,
    selector: 'assignment-resource-list',
    templateUrl: 'assignmentResourceList.component.html',
    styleUrls: ['assignmentResourceList.component.css'],
    inputs: ['showTrigger']
})
export class AssignmentResourceListComponent implements OnDestroy, OnInit {

    gridConfig: any = {
        getItems: (page: ResourcePage) => page.Resources,
        createRow: ResourceRow,
        rowSelection: 'multiple',
        hideTimePeriodScroll: true,
        height: "100%",
    };

    queryConfig: any = {
        aggregation: TimeAggregation.Weekly,
        query: "",
    };

    dataRequested($event: any) {
        $event.dataObservable = this.resourceService.getResourcePage($event.query);
    }

    _showTrigger: any;

    set showTrigger(v: any) {
        this._showTrigger = v;
        this.applyTrigger++;
    }

    applyTrigger = 1;

    constructor(
        private messageService: MessageService,
        private dateService: DateService,
        private resourceService: ResourceService) {

        this.createColumns();
    }

    ngOnInit() {
    }

    private createColumns() {
        this.gridConfig.columns = [
            {
                context: {
                    type: "resourceColumn",
                    index: 0
                },
                checkboxSelection: true,
                headerName: "Resource",
                field: "ResourceName",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
            },
            {
                context: { type: "resourceColumn", index: 1 },
                headerName: "Position",
                field: "Position",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            }
        ];

    }

    ngOnDestroy() {
    }
}