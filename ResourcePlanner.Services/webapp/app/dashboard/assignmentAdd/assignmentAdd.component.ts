import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../core';
import { Option, OptionService, Resource, ResourcePage, ResourceRow, ResourceService, TimeAggregation } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'assignment-add',
    templateUrl: 'assignmentAdd.component.html',
    styleUrls: ['assignmentAdd.component.css'],
    inputs: [
    'showTrigger']
})
export class AssignmentAddComponent implements OnDestroy, OnInit {

    visible: boolean = false;

    hoursPerDay: number;
    daysOfWeek: any;
    startDate: Date;
    endDate: Date;
    selectedPractice: number = -1;
    selectedSubPractice: number = -1;

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

        this.createColumns();
    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    save() {
        this.close();
    }

    ngOnInit() {
    }

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

    applyTrigger = 1;


    addProject() {
    }

    getPractices() {
        return this.optionService.practices;
    }

    getSubPractices() {
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