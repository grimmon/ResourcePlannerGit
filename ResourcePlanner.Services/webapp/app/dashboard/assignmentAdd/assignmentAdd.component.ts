import { Component, OnDestroy, OnInit, EventEmitter, Output, NgZone } from '@angular/core';
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

    @Output() addProjectRequested: EventEmitter<any>;

    set showTrigger(v: any) {
        this._showTrigger = v;
        if (this._showTrigger) {
            this.daysOfWeekSelector.set(CONFIG.defaultDaysOfWeek)
            this.messageService.modalToggle(this.visible = true);
            this.saving = false;
            setTimeout(() => {
                this.applyTrigger++;
                this.applyFiltersTrigger++;
            }, 100);
        }
    }
    _showTrigger = 0;

    visible: boolean = false;

    saving: boolean = false;

    applyTrigger = 1;

    applyFiltersTrigger = 0;

    gridConfig: any = {
        getItems: (page: ResourcePage) => page.Resources,
        createRow: ResourceRow,
        rowSelection: 'multiple',
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

    applyFiltersRequested($event: any) {
        this.filterQuery = $event;
        this.reloadGrid();
    }
    filterQuery: string = '';

    addAssignments: AddAssignments

    project: any;
    projectSource: any;
    projectListFormatter: any;

    currentDate: string;

    practice: number = -1;
    subPractice: number = -1;
    task: number = -1;
    positions: any[];

    private positionSelector: JQuery;
    private daysOfWeekSelector: any;

    hoursPerDayVisible = false;
    tasksVisible = false;

    clientNameChanged($event: any) {
    }
    constructor(
        private zone: NgZone,
        private messageService: MessageService,
        private optionService: OptionService,
        private dateService: DateService,
        private exceptionService: ExceptionService,
        private resourceService: ResourceService) {

        this.addProjectRequested = new EventEmitter();

        this.currentDate = this.dateService.format(new Date());

        this.addAssignments = new AddAssignments({
            resourceIds: [],
            projectMasterId: 0,
            startDate: this.currentDate,
            endDate: this.currentDate,
            daysOfWeek: CONFIG.defaultDaysOfWeek,
            hoursPerDay: CONFIG.defaultHoursPerDay
        });

        this.projectSource = this.optionService.setSource(CONFIG.urls.project);
        this.projectListFormatter = this.optionService.setListFormatter();

        this.createColumns();
    }

    ngOnInit() {

        this.messageService.onCategoriesLoaded(() => {
            this.positionSelector = this.optionService.initObservableSelector(
                ".position-selector",
                OptionType.Position,
                value => {
                    this.positions = value;
                    this.reloadGrid();
                },
                ''
            );
        });

        this.daysOfWeekSelector = this.optionService.initSelector(
            ".dayofweek-selector",
            CONFIG.daysOfWeek,
            CONFIG.defaultDaysOfWeek,
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
        if (this.tasksVisible) {
            this.addAssignments.projectMasterId = this.task;
        }
        else {
            this.addAssignments.projectMasterId = this.project.Id;
        }
        this.addAssignments.resourceIds = this.gridConfig.selectedIds;
        if (this.hoursPerDayVisible) {
            this.addAssignments.hoursPerWeek = null;
            
        }
        else {
            this.addAssignments.hoursPerDay = null;
            this.addAssignments.daysOfWeek = null;
        }

        this.saving = true;
        this.resourceService
            .addAssignments(this.addAssignments)
            .subscribe(res => {
                this.saving = false;
                this.close();
            });
    }

    private validate() {
        var errors: any[] = [];
        if (this.tasksVisible) {
            if (!this.task) {
                errors.push('Project or task must be selected')
            }
        }
        else {
            if (!this.project) {
                errors.push('Project must be selected.');
            }
        }
        if (!this.gridConfig.selectedIds.length) {
            errors.push('At least one resource must be selected.');
        }
        return errors.length ? errors : null;
    }

    //taskChanged($event: any) {
    //    this.ProjectMasterId = $event.target.value;
    //}

    startDateChanged($event: any) {
        this.addAssignments.startDate = $event.target.value;
        this.addAssignments.endDate = this.dateService.max(this.addAssignments.startDate, this.addAssignments.endDate);
        this.currentDate = this.addAssignments.startDate;
        this.reloadGrid();
    }

    endDateChanged($event: any) {
        this.addAssignments.endDate = $event.target.value;
        this.addAssignments.startDate = this.dateService.min(this.addAssignments.endDate, this.addAssignments.startDate);
        this.currentDate = this.addAssignments.startDate;
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
        if (this.filterQuery) {
            query += '&' + this.filterQuery
        }
        this.queryConfig.query = query;
        return query
    }

    addProject() {
        this.addProjectRequested.emit();
    }

    private getPractices() {
        return this.optionService.practices;
    }

    private getSubPractices() {
        return this.optionService.subPractices;
    }

    private getTasks() {
        return this.optionService.tasks;
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