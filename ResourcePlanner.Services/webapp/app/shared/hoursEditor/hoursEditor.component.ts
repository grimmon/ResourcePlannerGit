import { Component, OnDestroy, OnInit } from '@angular/core';

import { CONFIG, MessageService } from '../../core';
import { ResourceService, UpdateAssignment, AddAssignments, TimeAggregation } from '../../models';

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
            this.messageService.modalToggle(this.visible = true);
            this.resourceService
                .getAssignment(this.assignment)
                .subscribe(res => {
                    //console.log(res)
                    this.isNewAssignment = res.StartDate == '0001-01-01T00:00:00';
                    if (!this.isNewAssignment) {
                        this.hoursPerDay[0] = res.SundayHours;
                        this.hoursPerDay[1] = res.MondayHours;
                        this.hoursPerDay[2] = res.TuesdayHours;
                        this.hoursPerDay[3] = res.WednesdayHours;
                        this.hoursPerDay[4] = res.ThursdayHours;
                        this.hoursPerDay[5] = res.FridayHours;
                        this.hoursPerDay[6] = res.SaturdayHours;
                    }
                });
        }
    }
    get assignmentInfo() {
        return this._assignmentInfo;
    }
    _assignmentInfo: any;

    assignment: UpdateAssignment = new UpdateAssignment();

    visible: boolean = false;
    isNewAssignment = false;
    dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    hoursPerDay: number[] = [0, 0, 0, 0, 0, 0, 0];

    constructor(
        private resourceService: ResourceService,
        private messageService: MessageService) {
    }

    ngOnInit() {

    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    save() {

        if (this.isNewAssignment) {
            var addAssignments = new AddAssignments();
            addAssignments.resourceIds = [this.assignment.resourceId];
            addAssignments.projectMasterId = this.assignment.projectMasterId;
            addAssignments.hoursPerWeek = this.assignment.hoursPerWeek || null;
            addAssignments.startDate = this.assignment.startDate;
            addAssignments.endDate = this.assignment.startDate; //?
            addAssignments.SundayHours = this.hoursPerDay[0];
            addAssignments.MondayHours = this.hoursPerDay[1];
            addAssignments.TuesdayHours = this.hoursPerDay[2];
            addAssignments.WednesdayHours = this.hoursPerDay[3];
            addAssignments.ThursdayHours = this.hoursPerDay[4];
            addAssignments.FridayHours = this.hoursPerDay[5];
            addAssignments.SaturdayHours = this.hoursPerDay[6];

            this.resourceService
                .addAssignments(addAssignments)
                .subscribe(res => {
                    this.notify();
                });
        } else {
            this.assignment.SundayHours = this.hoursPerDay[0];
            this.assignment.MondayHours = this.hoursPerDay[1];
            this.assignment.TuesdayHours = this.hoursPerDay[2];
            this.assignment.WednesdayHours = this.hoursPerDay[3];
            this.assignment.ThursdayHours = this.hoursPerDay[4];
            this.assignment.FridayHours = this.hoursPerDay[5];
            this.assignment.SaturdayHours = this.hoursPerDay[6];
            this.resourceService
                .updateAssignment(this.assignment)
                .subscribe(res => {
                    this.notify();
                });
        }
    }

    notify() {
        this.messageService.timespanGridRefreshRequest(this._assignmentInfo.context);

    }
    ngOnDestroy() {
    }
}