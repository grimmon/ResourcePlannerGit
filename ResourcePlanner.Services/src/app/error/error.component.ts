import { Component, OnInit } from '@angular/core';
import { MessageService } from '../core';

@Component({
    moduleId: module.id.toString(),
    selector: 'resource-planner-error',
    templateUrl: 'error.component.html',
    styleUrls: ['error.component.css'],
})
export class ErrorComponent implements OnInit {
    visible = false;

    errorInfo: any = {};

    ngOnInit() {
    }

    constructor(
        private messageService: MessageService) {

        this.messageService.onErrorRequested(errorInfo => {
            if (errorInfo) {
                console.log(this.errorInfo);
            }
            this.errorInfo = errorInfo || {};

            this.visible = true;
        });
    }

    close() {
        this.visible = false;
    }
}