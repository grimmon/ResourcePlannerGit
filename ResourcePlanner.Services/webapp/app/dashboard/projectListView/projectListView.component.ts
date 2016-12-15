import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../core';
import { ProjectPage, ProjectInfo, ProjectResourceRow, ProjectService } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'project-list-view',
    templateUrl: 'projectListView.component.html',
    styleUrls: ['projectListView.component.css'],
    inputs: ['projectToView', 'showTrigger'],
})
export class ProjectListViewComponent implements OnDestroy, OnInit {
    visible: boolean = false;

    projectInfo: ProjectInfo;

    gridConfig: any = {
        getItems: (page: ProjectPage) => {
            this.projectInfo = page.ProjectInfo;
            return page.ProjectResource;
        },
        createRow: ProjectResourceRow,
        //showTimePeriodScroll: true,
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

    getStartDate() {
        return this.projectInfo ? this.dateService.formatString(this.projectInfo.StartDate) : '';
    }

    getEndDate() {
        return this.projectInfo ? this.dateService.formatString(this.projectInfo.EndDate) : '';
    }

    getDuration() {
        return this.projectInfo ? this.dateService.getDuration(this.projectInfo.StartDate, this.projectInfo.EndDate) : '';
    }

    constructor(
        private dateService: DateService,
        private messageService: MessageService,
        private projectService: ProjectService) {

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
                headerName: "Resource",
                field: "ResourceName",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
            },
            {
                context: { type: "resourceColumn", index: 1 },
                headerName: "Role",
                field: "Position",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context:
                { type: "resourceColumn", index: 2 },
                headerName: "Rate",
                field: "CostRate",
                width: 100,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceColumn", index: 3 },
                headerName: "Total Allocated",
                field: "TotalResourceHours",
                width: 100,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceColumn", index: 4 },
                headerName: "Total\nScheduled",
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