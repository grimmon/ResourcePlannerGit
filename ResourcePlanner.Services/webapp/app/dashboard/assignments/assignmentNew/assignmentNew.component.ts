import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Component({
    moduleId: module.id,
    selector: 'assignment-new',
    templateUrl: 'assignmentNew.component.html',
    styleUrls: ['assignmentNew.component.css']
})
export class AssignmentNewComponent implements OnDestroy, OnInit {

    title: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}