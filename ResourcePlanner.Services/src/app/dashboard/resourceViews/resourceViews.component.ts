import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Component({
    moduleId: module.id.toString(),
    selector: 'resource-views',
    templateUrl: 'resourceViews.component.html',
    styleUrls: ['resourceViews.component.css']
})
export class ResourceViewsComponent implements OnDestroy, OnInit {

    title: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}