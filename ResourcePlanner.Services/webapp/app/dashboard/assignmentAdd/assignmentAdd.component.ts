import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ExceptionService, MessageService, DateService } from '../../core';
import { OptionType, Option, OptionService, ResourcePage, ResourceRow, ResourceService, AddAssignments, TimeAggregation } from '../../models';
import { CONFIG } from '../../core';

@Component({
    moduleId: module.id,
    selector: 'assignment-add',
    templateUrl: 'assignmentAdd.component.html',
    styleUrls: ['assignmentAdd.component.css'],
    inputs: [
        'showTrigger'
    ]
})
export class AssignmentAddComponent implements OnDestroy, OnInit {

    set showTrigger(v: any) {
        this._showTrigger = v;
        if (this._showTrigger) {
            this.messageService.modalToggle(this.visible = true);
            this.saving = false;
            this.applyTrigger++;
        }
    }
    _showTrigger = 0;

    visible: boolean = false;

    saving: boolean = false;

    applyTrigger = 1;

    gridConfig: any = {
        getItems: (page: ResourcePage) => page.Resources,
        createRow: ResourceRow,
        rowSelection: 'multiple',
        hideTimePeriodScroll: true,
        height: "100%",
        selectedIds: [],
    };

    queryConfig: any = {
        aggregation: TimeAggregation.Weekly,
        query: this.getDefaultQuery(),
    };

    dataRequested($event: any) {
        $event.dataObservable = this.resourceService.getResourcePage($event.query);
    }

    refreshed($event: any) {
    }

    addAssignments: AddAssignments

    project: any;
    projectSource: any;
    projectListFormatter: any;

    currentDate: Date;

    practice: number = -1;
    subPractice: number = -1;
    positions: any[];

    private positionSelector: JQuery;
    private daysOfWeekSelector: JQuery;

    constructor(
        private messageService: MessageService,
        private optionService: OptionService,
        private dateService: DateService,
        private exceptionService: ExceptionService,
        private resourceService: ResourceService) {

        this.currentDate = new Date();

        this.addAssignments = new AddAssignments({
            resourceIds: [],
            projectId: 0,
            startDate: this.dateService.format(this.currentDate),
            endDate: this.dateService.format(this.currentDate),
            daysOfWeek: ['2', '3', '4', '5', '6'],
            hoursPerDay: 8
        });

        this.projectSource = this.optionService.setSource(CONFIG.urls.project);
        this.projectListFormatter = this.optionService.setListFormatter();

        this.createColumns();
    }

    ngOnInit() {

        this.positionSelector = this.optionService.initObservableSelector(
            "#assignmentPositionSelector",
            OptionType.Position,
            value => {
                this.positions = value;
                this.reloadGrid();
            });

        this.daysOfWeekSelector = this.optionService.initSelector(
            "#assignmentDOWSelector",
            CONFIG.daysOfWeek,
            ['2', '3', '4', '5', '6'],
            value => {
                this.addAssignments.daysOfWeek = value;
            });
    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    save() {
        var errors = this.validate();
        if (errors) {
            this.messageService.errorRequest({
                message: 'Save cannot be done because of the following:',
                messages: errors
            });
            return;
        }

        this.addAssignments.projectId = this.project.Id;
        this.addAssignments.resourceIds = this.gridConfig.selectedIds;

        this.saving = true;
        this.resourceService
            .addAssignments(this.addAssignments)
            .subscribe(res => {
                this.saving = false;
                //this.close();
            });
    }

    private validate() {
        var errors: any[] = [];
        if (!this.project) {
            errors.push('Project must be selected.');
        }
        if (!this.gridConfig.selectedIds.length) {
            errors.push('At least one resource must be selected.');
        }
        return errors.length ? errors : null;
    }

    positionChanged($event: any) {
        this.positions = $event.target.value;
        this.reloadGrid();
    }

    practiceChanged($event: any) {
        this.practice = $event.target.value;
        this.reloadGrid();
    }

    subPracticeChanged($event: any) {
        this.subPractice = $event.target.value;
        this.reloadGrid();
    }

    startDateChanged($event: any) {
        this.addAssignments.startDate = $event.target.value;
        this.addAssignments.endDate = this.dateService.max(this.addAssignments.startDate, this.addAssignments.endDate);
        this.currentDate = new Date(this.addAssignments.startDate);
        this.reloadGrid();
    }

    endDateChanged($event: any) {
        this.addAssignments.endDate = $event.target.value;
        this.addAssignments.startDate = this.dateService.min(this.addAssignments.endDate, this.addAssignments.startDate);
        this.currentDate = new Date(this.addAssignments.startDate);
        this.reloadGrid();
    }

    private reloadGrid() {
        this.buildQuery();
        this.applyTrigger++;
    }

    private addParam(keyword: string, value: any) {
        return value == -1 || value == '' ? '' : '&' + keyword + '=' + value;
    }

    private getDefaultQuery() {
        return 'availability=true';
    }

    private buildQuery(): string {
        var query = this.getDefaultQuery();
        query += this.addParam('practice', this.practice);
        query += this.addParam('subpractice', this.subPractice);
        if (this.positions) {
            query += this.addParam('position', this.positions.join(','));
        }

        this.queryConfig.query = query;
        return query
    }

    addProject() {
    }

    private getPractices() {
        return this.optionService.practices;
    }

    private getSubPractices() {
        return this.optionService.subPractices;
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