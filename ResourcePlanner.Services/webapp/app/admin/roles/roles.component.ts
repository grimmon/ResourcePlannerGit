import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Component({
    moduleId: module.id,
    selector: 'roles',
    templateUrl: 'roles.component.html',
    styleUrls: ['roles.component.css']
})
export class RolesComponent implements OnDestroy, OnInit {

    title: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}