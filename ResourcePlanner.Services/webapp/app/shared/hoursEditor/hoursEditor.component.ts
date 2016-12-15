import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { CONFIG, MessageService, DateService } from '../../core';
import { ResourceService, OptionService, AddAssignments, TimeAggregation } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'hours-editor',
    templateUrl: 'hoursEditor.component.html',
    styleUrls: ['hoursEditor.component.css'],
    inputs: [
        'showTrigger',
        'assignments'
    ]
})
export class AssignmentAddComponent implements OnDestroy, OnInit {

    @Output() assignmentsSaved: EventEmitter<any>;

    set showTrigger(v: any) {
        this._showTrigger = v;
        if (this._showTrigger) {
            this.messageService.modalToggle(this.visible = true);
        }
    }
    _showTrigger = 0;

    set assignments(v: any) {
        this._assignments = v;
        if (this._assignments) {
        }
    }
    get assignments() {
        return this._assignments;
    }
    _assignments: AddAssignments;

    visible: boolean = false;

    private daysOfWeekSelector: JQuery;

    constructor(
        private optionService: OptionService,
        private messageService: MessageService,
        private dateService: DateService,
        private resourceService: ResourceService) {

        this.assignmentsSaved = new EventEmitter();
    }

    ngOnInit() {

        this.daysOfWeekSelector = this.optionService.initSelector(
            ".assignment-editor-dayofweek",
            CONFIG.daysOfWeek,
            ['2', '3', '4', '5', '6'],
            (value: any) => {
                this.assignments.daysOfWeek = value;
            });
    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    save() {
        //this.resourceService
        //    .updateAssignments(this.assignments)
        //    .subscribe(res => {
        //        this.assignmentsSaved.emit(this.assignments);
        //        this.close();
        //    });
    }

    ngOnDestroy() {
    }
}