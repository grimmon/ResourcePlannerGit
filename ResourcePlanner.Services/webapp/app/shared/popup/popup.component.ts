import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { CONFIG, MessageService, DateService } from '../../core';
import { ResourceService } from '../../models';

declare var c3: any;

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
            this.setPosition();
        }
    }
    get config() {
        return this._config;
    }
    _config: any;

    popupElement: any;

    visible: boolean = false;

    loading: boolean = false;

    chart: any;

    constructor(
        private resourceService: ResourceService,
        private dateService: DateService,
        private messageService: MessageService) {
    }

    ngOnInit() {
        this.popupElement = document.getElementById('resourcePopup');
        this.chart = c3.generate({
            bindto: '#resourcePopup .pieContainer',
            data: {
                columns: [
                    ["Project", 0],
                    ["Pto", 0],
                    ["Training", 0],
                    ["Internal", 0],
                    ["Other", 1],
                ],
                type: 'pie',
            },
            color: {
                pattern: ['green', 'red', 'blue', 'yellow', 'gray'],
            },
            size: {
                height: 150,
                width: 150
            },
            tooltip: {
                format: {
                    value: function (value: any, ratio: any, id: any) {
                        //console.log(`value:${value} ratio:${ratio} id${id}`)
                        return value.toFixed(1) + ' hours';
                    }
                }
            }
        });
    }

    setPosition() {
        console.log(this._config)
        var config = this._config,
            event = config.event,
            target = event.target,
            clientX = event.clientX - event.offsetX + target.offsetWidth / 2 - 75,
            clientY = event.clientY - event.offsetY - 70 - target.offsetHeight - 70,
            resourceId = config.resourceId,
            from = this.dateService.format(config.periodStart), // '2017-01-22',
            to = this.dateService.format(config.periodEnd); // '2017-01-28';
        this.popupElement.style.top = clientY + 'px';
        this.popupElement.style.left = clientX + 'px';
        this.chart.unload();
        this.loading = true;
        this.visible = true;
        this.resourceService.getResourceBreakdown(`?ResourceId=${resourceId}&StartDate=${from}&EndDate=${to}`).subscribe((breakdown: any) => {
            this.chart.load({
                columns: [
                    ["Project", breakdown.ProjectHours],
                    ["Pto", breakdown.PtoHours],
                    ["Training", breakdown.TrainingHours],
                    ["Internal", breakdown.InternalProjectHours],
                    ["Other", breakdown.OtherHours],
                ]
            });
            this.loading = false;
       });
    }

    ngOnDestroy() {
    }
}