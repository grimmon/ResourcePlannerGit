import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Component({
    moduleId: module.id,
    selector: 'project-add',
    templateUrl: 'projectAdd.component.html',
    styleUrls: ['projectAdd.component.css']
})
export class ProjectAddComponent implements OnDestroy, OnInit {

    title: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}