import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { CONFIG, MessageService } from '../../core';
import { ResourceService, OptionService, UpdateAssignment, TimeAggregation } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'hours-editor',
    templateUrl: 'hoursEditor.component.html',
    styleUrls: ['hoursEditor.component.css'],
    inputs: [
        'assignmentInfo'
    ]
})
export class HoursEditorComponent implements OnDestroy, OnInit {

     set assignmentInfo(v: any) {
        this._assignmentInfo = v;
        if (this._assignmentInfo) {
            this.assignment = this._assignmentInfo.assignment;
            this.messageService.modalToggle(this.visible = true);
       }
    }
    get assignmentInfo() {
        return this._assignmentInfo;
    }
    _assignmentInfo: any;

    assignment: UpdateAssignment = new UpdateAssignment();

    visible: boolean = false;

    private daysOfWeekSelector: JQuery;

    constructor(
        private optionService: OptionService,
        private messageService: MessageService,
        private resourceService: ResourceService) {
    }

    ngOnInit() {

        this.daysOfWeekSelector = this.optionService.initSelector(
            ".assignment-editor-dayofweek",
            CONFIG.daysOfWeek,
            ['2', '3', '4', '5', '6'],
            (value: any) => {
                this.assignment.daysOfWeek = value;
            });
    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    save() {
        //this.resourceService
        //    .updateAssignments(this.assignment)
        //    .subscribe(res => {
        //debugger;
        this.messageService.timespanGridRefreshRequest(this._assignmentInfo.context);
                this.close();
        //    });
    }

    ngOnDestroy() {
    }
}