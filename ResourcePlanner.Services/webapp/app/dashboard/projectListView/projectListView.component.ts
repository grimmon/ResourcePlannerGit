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
    styleUrls: ['projectListView.component.css'],
    inputs: ['projectToView', 'showTrigger'],
})
export class ProjectListViewComponent implements OnDestroy, OnInit {
    visible: boolean = false;

    gridConfig: any = {
        getItems: (page: ProjectPage) => page.ProjectResource,
        createRow: ProjectResourceRow,
        hideTimePeriodScroll: true,
        height: "100%",
    };

    queryConfig: any = {
        query: "projectId=0",
    };

    _showTrigger: any;
    _projectTrigged = 0;

    set showTrigger(v: any) {
        this._showTrigger = v;
        if (this._projectToView.Id) {
            if (this._projectTrigged != this._projectToView.Id) {
                this.applyTrigger++;
                this._projectTrigged = this._projectToView.Id
            }
            this.messageService.modalToggle(this.visible = true);
        }
    }

    applyTrigger = 0;

    _projectToView: any = {};
    set projectToView(v: number) {
        this._projectToView = v;
    }
    get projectToView() {
        return this._projectToView;
    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }


    dataRequested($event: any) {
        $event.dataObservable = this.projectService.getProjects("?projectId=" + this._projectToView.Id);
    }

    constructor(
        private messageService: MessageService,
        private projectService: ProjectService,
        private route: ActivatedRoute,
        private router: Router) {

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

    ngOnDestroy() {
    }
}