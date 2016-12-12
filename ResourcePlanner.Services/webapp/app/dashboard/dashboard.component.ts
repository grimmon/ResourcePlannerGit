import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Option, CategoryOption, OptionService } from '../models';


@Component({
    moduleId: module.id,
    selector: 'resource-planner-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {

    title: string;

    categoryOptions: Array<CategoryOption> = new Array<CategoryOption>();



    constructor(
        private route: ActivatedRoute,
        private router: Router) {

        this.categoryOptions.push(new CategoryOption({ Id: 8, Name: 'xxx', Category: 'zzz' }));

    }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}