import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { EntityService } from '../core';
import { CategoryOption } from '../models';


@Component({
    moduleId: module.id,
    selector: 'resource-planner-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {

    categoryOptions: Array<CategoryOption> = new Array<CategoryOption>();

    projectToView: any = {};
    projectShow = 0;

    projectResourceViewRequested($event: any) {
        this.projectToView = $event;
        //this.projectToView = this.entityService.clone($event);
        this.projectShow++;
    }

    constructor(
        private entityService: EntityService,
        private route: ActivatedRoute,
        private router: Router) {

        this.categoryOptions.push(new CategoryOption({ Id: 8, Name: 'xxx', Category: 'zzz' }));

    }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}