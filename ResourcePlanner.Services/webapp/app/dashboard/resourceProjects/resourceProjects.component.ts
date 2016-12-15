import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../core';
import { DetailPage, ProjectDetailRow, ResourceService, TimeAggregation } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'resource-projects',
    templateUrl: 'resourceProjects.component.html',
    styleUrls: ['resourceProjects.component.css'],
    inputs: [
        'resourceId'
        ]
})
export class ResourceProjectsComponent implements OnDestroy, OnInit {

    _resourceId: number;

    set resourceId(v: number) {
        this._resourceId = v;
        if (this._resourceId) {
            this.queryConfig.query = "ResourceId=" + this._resourceId;
            this.applyTrigger++;
        }
    }

    applyTrigger: number = 0;

    periodScrollTrigger: {}

    gridConfig: any = {
        getItems: (page: DetailPage) => page.Projects,
        createRow: ProjectDetailRow,
        hideTimePeriodScroll: true,
        height: "200px"
    };

    queryConfig: any = {
        aggregation: TimeAggregation.Weekly,
        query: "ResourceId=" + this.resourceId,
    };

    dataRequested($event: any) {
        $event.dataObservable = this.resourceService.getResourceDetailPage($event.query);
    }

    rowSelected($event: any) {
        this.projectViewRequested.emit($event.rowData)
    }

    @Output() projectViewRequested: EventEmitter<any>;

    constructor(
        private messageService: MessageService,
        private dateService: DateService,
        private resourceService: ResourceService,
        private route: ActivatedRoute,
        private router: Router) {

        this.projectViewRequested = new EventEmitter<any>();

        this.messageService.onResourcePeriodScrolled(step => {
            if (this._resourceId) {
                this.periodScrollTrigger = { step: step };
            }
        });

        this.messageService.onResourceFilterChanged(filterInfo => {
            switch (filterInfo.type) {
                case 'cleared':
                    this.queryConfig.aggregation = filterInfo.value.aggregation;
                    break;
                case 'aggregation':
                    this.queryConfig.aggregation = filterInfo.value;
                    break;
            }
        });

        this.createColumns();
    }

    ngOnInit() {
    }

    private createColumns() {
        this.gridConfig.columns = [
            {
                context: { type: "resourceDetailColumn", index: 0 },
                headerName: "Project Name",
                field: "ProjectName",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
            },
            {
                context: { type: "resourceDetailColumn", index: 1 },
                headerName: "Project Number",
                field: "ProjectNumber",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context:  { type: "resourceDetailColumn", index: 2 },
                headerName: "WBS Element",
                field: "WBSElement",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceDetailColumn", index: 3 },
                headerName: "Client",
                field: "Client",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceDetailColumn", index: 4 },
                headerName: "Opportunity Owner",
                field: "OpportunityOwner",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceDetailColumn", index: 5 },
                headerName: "Project Manager",
                field: "ProjectManager",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceDetailColumn", index: 6 },
                headerName: "Description",
                field: "Description",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
        ];

    }

    private apply(filters: any) {
        this.queryConfig.query = filters;
        this.applyTrigger++;
    }

    ngOnDestroy() {
    }
}