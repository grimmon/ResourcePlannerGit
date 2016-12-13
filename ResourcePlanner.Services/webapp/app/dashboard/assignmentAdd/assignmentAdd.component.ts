import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../core';
import { Option, OptionService, ResourcePage, ResourceRow, ResourceService, AddAssignments, TimeAggregation } from '../../models';
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

    visible: boolean = false;
    saving: boolean = false;

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
        //this.startDate = this.dateService.format(this.queryConfig.startDate);
        //this.endDate = this.dateService.format(this.queryConfig.endDate);
    }

    applyTrigger = 1;

    addAssignments: AddAssignments = new AddAssignments();

    selectedProject: any;
    projectSource: any;
    projectListFormatter: any;

    currentDate: Date = new Date();
    startDate: any;
    endDate: any;

    selectedPractice: number = -1;
    selectedSubPractice: number = -1;
    selectedPositions: any[];

    _showTrigger = 0;
    set showTrigger(v: any) {
        this._showTrigger = v;
        if (this._showTrigger) {
            this.messageService.modalToggle(this.visible = true);
            this.applyTrigger++;
        }
    }

    constructor(

        private messageService: MessageService,
        private optionService: OptionService,
        private dateService: DateService,
        private resourceService: ResourceService) {

        this.addAssignments.resourceIds = [];
        this.addAssignments.projectId = 0;
        this.addAssignments.startDate = this.dateService.format(this.currentDate);
        this.addAssignments.endDate = this.dateService.format(this.currentDate);
        this.addAssignments.daysOfWeek = [1,2,3,4,5];
        this.addAssignments.hoursPerDay = 8;

        this.projectSource = this.setProjectSource(this);
        this.projectListFormatter = this.setProjectListFormatter();

        this.createColumns();
    }

    ngOnInit() {
        this.positionSelectorInit();
        this.daysOfWeekSelectorInit();
    }

    private positionSelector: JQuery;
    private positionSelectorInit() {
        this.positionSelector = $("#assignmentPositionSelector");

        this.optionService.categories.subscribe(categoryOptions => {
            this.positionSelector.select2({
                data: this.optionService.positions.map(pos => {
                    return {
                        id: pos.Id,
                        text: pos.Name,
                    }
                })
            });
            this.positionSelector.on("change", () => {
                this.selectedPositions = this.positionSelector.select2('val');
                this.reloadGrid();
            });
        });
    }

    private daysOfWeekSelector: JQuery;
    private daysOfWeekSelectorInit() {

        this.daysOfWeekSelector = $("#assignmentDOWSelector");

        this.daysOfWeekSelector.select2({
            data: [{ id: 2, text: 'Monday', short: "Mon" }
                , { id: 3, text: 'Tuesday', short: "Tue" }
                , { id: 4, text: 'Wednesday', short: "Wed" }
                , { id: 5, text: 'Thursday', short: "Thu" }
                , { id: 6, text: 'Friday', short: "Fri" }
                , { id: 7, text: 'Saturday', short: "Sat" }
                , { id: 1, text: 'Sunday', short: "Sun" }]
        });
    }

    setProjectSource(instance: any) {
        return function (term: string) {
            return instance.optionService.getOptions(CONFIG.urls.project, term);
        }
    }

    setProjectListFormatter() {
        return function (data: any) {
            var html = "";
            html += data[this.displayPropertyName] ? "<span>" + data[this.displayPropertyName] + "</span>" : data;
            return html;
        }
    };
    private displayPropertyName: string;

    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    save() {
        this.saving = true;

        this.addAssignments.projectId = this.selectedProject.Id;
        this.addAssignments.resourceIds = this.gridConfig.selectedIds;


        this.resourceService
            .addAssignments(this.addAssignments)
            .subscribe(res => {
                this.saving = false;
                //this.close();
            });
    }

    positionChanged($event: any) {
        this.selectedPositions = $event.target.value;
        this.reloadGrid();
    }

    practiceChanged($event: any) {
        this.selectedPractice = $event.target.value;
        this.reloadGrid();
    }

    subPracticeChanged($event: any) {
        this.selectedSubPractice = $event.target.value;
        this.reloadGrid();
    }

    startDateChanged($event: any) {
        this.startDate = $event.target.value;
        this.currentDate = new Date(this.startDate);
        this.reloadGrid();
    }

    endDateChanged($event: any) {
        this.endDate = $event.target.value;
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
        query += this.addParam('practice', this.selectedPractice);
        query += this.addParam('subpractice', this.selectedSubPractice);
        if (this.selectedPositions) {
            query += this.addParam('position', this.selectedPositions.join(','));
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