import { Component, OnDestroy, OnInit } from '@angular/core';

import { CONFIG, MessageService } from '../../core';
import { ResourceService } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'resource-popup',
    templateUrl: 'popup.component.html',
    styleUrls: ['popup.component.css'],
    inputs: ['config']
})
export class PopupComponent implements OnDestroy, OnInit {

    set config(v: any) {
        if (this._config = v) {
            this.visible = true;
        }
    }


    get gonfig() {
        return this._config;
    }
    _config: any;

    visible: boolean = false;

    constructor(
        private resourceService: ResourceService,
        private messageService: MessageService) {
    }

    ngOnInit() {
    }

    close() {
    }

    ngOnDestroy() {
    }
}