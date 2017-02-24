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

    addProject() {
        this.addProjectRequested.emit();
    }

    set showTrigger(v: any) {
        this._showTrigger = v;
        if (this._showTrigger) {
            this.daysOfWeekSelector.set(CONFIG.defaultDaysOfWeek)
            this.messageService.modalToggle(this.visible = true);
            this.saving = false;
            setTimeout(() => {
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
        query: '',
    };

    dataRequested($event: any) {
        $event.dataObservable = this.resourceService.getResourcePage($event.query);
    }

    refreshed($event: any) {
    }

    close() {
        this.messageService.modalToggle(this.visible = false);
        this.gridConfig.selectedIds = [];
    }

    save() {
        if (this.validate()) {
            this.addAssignments.projectMasterId = this.tasksVisible ? this.task : this.project.Id;
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
                    this.messageService.timespanGridRefreshRequest('resource-list');
                });
        }
    }

    applyFiltersRequested($event: any) {
        this.filterQuery = $event.filterQuery;
        this.reloadGrid($event.force);
    }
    filterQuery: string = '';

    addAssignments: AddAssignments

    project: any;
    projectSource: any;
    projectListFormatter: any;

    currentDate: string;

    startDateChanged($event: any) {
        this.addAssignments.startDate = $event.target.value;
        //this.addAssignments.endDate = this.dateService.max(this.addAssignments.startDate, this.addAssignments.endDate);
        this.currentDate = this.addAssignments.startDate;
        this.reloadGrid(true);
    }

    endDateChanged($event: any) {
        this.addAssignments.endDate = $event.target.value;
        //this.addAssignments.startDate = this.dateService.min(this.addAssignments.endDate, this.addAssignments.startDate);
        this.currentDate = this.addAssignments.startDate;
        this.reloadGrid(true);
    }

    addProjectToList(project: any) {
        this.project = project;
        this.addAssignments.projectMasterId = project.Id;
    }

    task: number = -1;
    tasksVisible = false;

    private daysOfWeekSelector: any;

    hoursPerDayVisible = false;

    constructor(
        private zone: NgZone,
        private messageService: MessageService,
        private optionService: OptionService,
        private dateService: DateService,
        private exceptionService: ExceptionService,
        private resourceService: ResourceService) {

        this.addProjectRequested = new EventEmitter();

        this.messageService.onProjectAdded(project => this.addProjectToList(project));

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
        this.daysOfWeekSelector = this.optionService.initSelector(
            ".dayofweek-selector",
            CONFIG.daysOfWeek,
            CONFIG.defaultDaysOfWeek,
            value => {
                this.addAssignments.daysOfWeek = value;
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
        if (this.addAssignments.endDate < this.addAssignments.startDate) {
            errors.push('Start date must come before end date.')
        }
        if (!this.gridConfig.selectedIds.length) {
            errors.push('At least one resource must be selected.');
        }
        if (errors.length) {
            this.messageService.errorRequest({
                message: 'Save cannot be done because of the following:',
                messages: errors
            });
            return false;
        }
        return true;
    }

    private reloadGrid(force: boolean) {
        var query = this.getDefaultQuery();
        if (this.filterQuery) {
            query += '&' + this.filterQuery
        }
        if (force || this.queryConfig.query != query) {
            this.queryConfig.query = query;
            this.applyTrigger++;
        }
    }

    private getDefaultQuery() {
        return 'availability=true';
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