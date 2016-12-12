import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from '../../../core';

@Component({
    moduleId: module.id,
    selector: 'assignment-add',
    templateUrl: 'assignmentAdd.component.html',
    styleUrls: ['assignmentAdd.component.css'],
    inputs: [
    'showTrigger']
})
export class AssignmentAddComponent implements OnDestroy, OnInit {

    visible: boolean = false;

    _showTrigger = 0;
    
    set showTrigger(v: any) {
        this._showTrigger = v;
        if (this._showTrigger) {
            this.messageService.modalToggle(this.visible = true);
            this.showList++;
        }
    }

    showList = 1;

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router) { }


    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    save() {
        this.close();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}