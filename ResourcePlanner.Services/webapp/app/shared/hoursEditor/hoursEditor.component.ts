import { Component, OnDestroy, OnInit } from '@angular/core';

import { CONFIG, MessageService } from '../../core';
import { ResourceService, OptionService, UpdateAssignment, TimeAggregation } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'hours-editor',
    templateUrl: 'hoursEditor.component.html',
    styleUrls: ['hoursEditor.component.css'],
    inputs: ['assignmentInfo']
})
export class HoursEditorComponent implements OnDestroy, OnInit {

    set assignmentInfo(v: any) {
        if (this._assignmentInfo = v) {
            this.assignment = this._assignmentInfo.assignment;
            this.daysOfWeekSelector.set(this.assignment.daysOfWeek);
            this.messageService.modalToggle(this.visible = true);
        }
    }
    get assignmentInfo() {
        return this._assignmentInfo;
    }
    _assignmentInfo: any;

    assignment: UpdateAssignment = new UpdateAssignment();

    visible: boolean = false;

    constructor(
        private optionService: OptionService,
        private resourceService: ResourceService,
        private messageService: MessageService) {
    }

    daysOfWeekSelector: any;

    ngOnInit() {

        this.daysOfWeekSelector = this.optionService.initSelector(
            ".assignment-editor-dayofweek",
            CONFIG.daysOfWeek,
            CONFIG.defaultDaysOfWeek,
            (value: any) => {
                this.assignment.daysOfWeek = value;
            });
    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    save() {
        this.resourceService
            .updateAssignment(this.assignment)
            .subscribe(res => {
                this.messageService.timespanGridRefreshRequest(this._assignmentInfo.context);
                this.close();
            });
    }

    ngOnDestroy() {
    }
}