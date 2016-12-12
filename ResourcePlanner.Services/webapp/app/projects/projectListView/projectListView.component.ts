import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService } from '../../core';
import { ProjectPage, ProjectResourceRow, ProjectService } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'project-list-view',
    templateUrl: 'projectListView.component.html',
    styleUrls: ['projectListView.component.css']
})
export class ProjectListViewComponent implements OnDestroy, OnInit {
    gridConfig: any = {
        getItems: (page: ProjectPage) => page.ProjectResource,
        createRow: ProjectResourceRow,
        hideTimePeriodScroll: true,
        height: "500px",
    };

    queryConfig: any = {
        query: "projectId=",
    };

    applyTrigger: number = 0;

    dataRequested($event: any) {
        $event.dataObservable = this.projectService.getProjects($event.query);
    }

    constructor(
        private messageService: MessageService,
        private projectService: ProjectService,
        private route: ActivatedRoute,
        private router: Router) {

        this.messageService.onApplyRequested(filters => this.apply(filters));

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
                headerName: "Resource Name",
                field: "ResourceName",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
            },
            {
                context: { type: "resourceColumn", index: 1 },
                headerName: "Title",
                field: "Position",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context:
                { type: "resourceColumn", index: 2 },
                headerName: "Cost Rate",
                field: "CostRate",
                width: 100,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceColumn", index: 3 },
                headerName: "Total Resourced",
                field: "TotalResourceHours",
                width: 100,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceColumn", index: 4 },
                headerName: "Total Forcasted",
                field: "TotalForecastHours",
                width: 100,
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