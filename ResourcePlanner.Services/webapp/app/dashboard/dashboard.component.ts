import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from '../core';
import { CategoryOption } from '../models';


@Component({
    moduleId: module.id,
    selector: 'resource-planner-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {

    categoryOptions: Array<CategoryOption> = new Array<CategoryOption>();

    projectResourceViewRequested($event: any) {
        this.projectToView = $event; 
        this.projectShow++;
    }
    projectShow = 0;
    projectToView: any = {};

    assignmentAddRequested() {
        this.assignmentAddShow++;
    }
    assignmentAddShow = 0;

    addProjectRequested() {
        this.addProjectShow++;
    }
    addProjectShow = 0;

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router) {

        this.categoryOptions.push(new CategoryOption({ Id: 8, Name: 'xxx', Category: 'zzz' }));

        this.messageService.onAddAssignmentRequested(state => {
            this.assignmentAddShow++;
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}