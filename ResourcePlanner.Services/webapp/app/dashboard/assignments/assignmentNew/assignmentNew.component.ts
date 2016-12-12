import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Option, OptionService } from '../../../models';


@Component({
    moduleId: module.id,
    selector: 'assignment-new',
    templateUrl: 'assignmentNew.component.html',
    styleUrls: ['assignmentNew.component.css']
})
export class AssignmentNewComponent implements OnDestroy, OnInit {

    hoursPerDay: number;
    daysOfWeek: any;
    startDate: Date;
    endDate: Date;
    selectedPractice: number = -1;
    selectedSubPractice: number = -1;

    constructor(
        private optionService: OptionService) { }

    ngOnInit() {
    }

    addProject() {
    }

    getPractices() {
        return this.optionService.practices;
    }

    getSubPractices() {
        return this.optionService.subPractices;
    }

    ngOnDestroy() {
    }
}