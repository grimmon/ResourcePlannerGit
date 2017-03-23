import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../core';
import { DetailPage, ProjectDetailRow, ResourceService, AddAssignments, UpdateAssignment, TimeAggregation, OptionService } from '../../models';
import {DeleteAssignment} from "../../models/assignment.model";

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

    @Output() projectViewRequested: EventEmitter<any>;

    _resourceId: number = 0;

    set resourceId(v: number) {
        this._resourceId = v;
        if (this._resourceId) {
            this.queryConfig.query = "ResourceId=" + this._resourceId;
            this.applyTrigger++;
        }
    }
    get resourceId() {
        return this._resourceId;
    }

    applyTrigger: number = 0;

    periodScrollTrigger: {}

    gridConfig: any = {
        context: "resource-projects",
        refreshContexts: ["resource-projects", "resource-list"],
        getItems: (page: DetailPage) => page.Projects,
        createRow: ProjectDetailRow,
        allowDataEdit: true,
        height: "200px",
        saveEditedCell: (params: any) => {
            var assignment = params.assignment;
            assignment.resourceId = this.resourceId;
            this.resourceService
                .updateAssignment(assignment)
                .subscribe(res => {
                    this.messageService.timespanGridRefreshRequest(params.context);
                });
        }
    };

    queryConfig: any = {
        aggregation: TimeAggregation.Weekly,
        query: "ResourceId=" + this.resourceId,
    };

    dataRequested($event: any) {
        $event.dataObservable = this.resourceId ? this.resourceService.getResourceDetailPage($event.query + '&agg=' + this.queryConfig.aggregation) : null;
    }

    rowSelected($event: any) {
        this.projectViewRequested.emit($event.rowData)
    }

    dataCellEditorRequested($event: any) {
        var assignment: UpdateAssignment = $event.assignment
        assignment.resourceId = this.resourceId;
        this.messageService.assignmentEditorRequest($event);
    }

    dataCellEditRequested($event: any) {
        var assignment: UpdateAssignment = $event.assignment
        assignment.resourceId = this.resourceId;
    }

    deleteAssignment($event: any){
        console.log(this.resourceId);
        console.log(this.gridConfig.selectedIds);
        let assignment: DeleteAssignment = new DeleteAssignment(this.resourceId, this.gridConfig.selectedIds[0]);
        this.messageService.resourceRemovalRequest(assignment);
    }

    constructor(
        private messageService: MessageService,
        private dateService: DateService,
        private resourceService: ResourceService,
        private route: ActivatedRoute,
        private router: Router,
        private optionService: OptionService
            ) {

        this.projectViewRequested = new EventEmitter<any>();

        this.messageService.onResourcePeriodScrolled(periodInfo => {
            if (this._resourceId) {
                this.periodScrollTrigger = { step: periodInfo.step };
            }
            else {
                this.queryConfig.currentDate = periodInfo.newDate;
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
                hide: this.optionService.getDetailColumnOption("Project Name") || false
            },
            {
                context: { type: "resourceDetailColumn", index: 1 },
                headerName: "Project Number",
                field: "ProjectNumber",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getDetailColumnOption("Project Number") || false
            },
            {
                context:  { type: "resourceDetailColumn", index: 2 },
                headerName: "WBS Element",
                field: "WBSElement",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getDetailColumnOption("WBS Element") || false
            },
            {
                context: { type: "resourceDetailColumn", index: 3 },
                headerName: "Client",
                field: "Client",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getDetailColumnOption("Client") || false
            },
            {
                context: { type: "resourceDetailColumn", index: 4 },
                headerName: "Opportunity Owner",
                field: "OpportunityOwner",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getDetailColumnOption("Opportunity Owner") || false
            },
            {
                context: { type: "resourceDetailColumn", index: 5 },
                headerName: "Project Manager",
                field: "ProjectManager",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getDetailColumnOption("Project Manager") || false
            },
            {
                context: { type: "resourceDetailColumn", index: 6 },
                headerName: "Description",
                field: "Description",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getDetailColumnOption("Description") || false
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