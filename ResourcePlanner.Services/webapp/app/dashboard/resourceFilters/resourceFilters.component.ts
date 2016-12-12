import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService } from '../../core';
import { Option, CategoryOption, OptionService, TimeAggregation } from '../../models';
declare var tagit: any;

@Component({
    moduleId: module.id,
    selector: 'resource-filters',
    templateUrl: 'resourceFilters.component.html',
    styleUrls: ['resourceFilters.component.css'],
    inputs: ['categoryOptions']
})
export class ResourceFiltersComponent implements OnDestroy, OnInit {

    visible: boolean = true;

    categoryOptions: Array<CategoryOption> = new Array<CategoryOption>();

    selectedCity: number;
    selectedOrgUnit: number;
    selectedRegion: number;
    selectedMarket: number;
    selectedPractice: number;
    selectedSubPractice: number;
    selectedAggregation: TimeAggregation;
    selectedResourceManager: number;

    aggregationChange(newAggregation: any) {
        this.messageService.resourceFilterChange('aggregation', parseInt(newAggregation));
    }

    getCities() {
        return this.optionService.cities;
    }

    getOrgUnits() {
        return this.optionService.orgUnits;
    }

    getRegions() {
        return this.optionService.regions;
    }

    getMarkets() {
        return this.optionService.markets;
    }

    getAggregations() {
        return this.optionService.aggregations;
    }

    getResourceManagers() {
        return this.optionService.resourceManagers;
    }

    getPractices() {
        return this.optionService.practices;
    }

    getSubPractices() {
        return this.optionService.subPractices;
    }

    clear() {
        this.selectedCity = -1;
        this.selectedOrgUnit = -1;
        this.selectedRegion = -1;
        this.selectedMarket = -1;
        this.selectedPractice = -1;
        this.selectedSubPractice = -1;
        this.selectedAggregation = TimeAggregation.Weekly;
        this.selectedResourceManager = -1;
        this.tags.tagit("removeAll");

        this.messageService.resourceFilterChange('cleared', {
            aggregation: this.selectedAggregation
        })
    }

    apply() {
        this.callFiltered("apply");
    }

    constructor(
        private messageService: MessageService,
        private optionService: OptionService) {

        this.messageService.onFilterPanelToggled(state => {
            this.visible = !this.visible
        });

        this.messageService.onFilteredRequested(operation => this.callFiltered(operation));

    }

    ngOnInit() {
        this.tags = $("#myTags");

        this.tags.tagit({
            fieldName: "searchbar",
            caseSensitive: false,
            readOnly: false,
            tagLimit: 3,
            placeholderText: "Search",
            afterTagAdded: function (event: any, ui: any) { this.placeholderText = null },
            onTagLimitExceeded: function (event: any, ui: any) {
                this.readOnly = true;
            }
        });

        this.clear();
    }

    private tags: JQuery;

    private filterQuery: string;

    private addFilter(key: string, value: any) {
        this.filterQuery += (this.filterQuery ? "&" : "") + key + "=" + value;
    }

    private add(key: string, value: string) {
        if (value) {
            this.addFilter(key, value);
        }
    }

    private addOption(key: string, option: number) {
        if (option > -1) {
            this.addFilter(key, option);
        }
    }

    private buildFilters() {
        this.filterQuery = '';
        var myTags = this.tags.tagit("assignedTags") as Array<string>;
        for (var i = 1; i <= myTags.length; i++) {
            var searchTerm = myTags[i - 1];
            if (searchTerm) {
                this.add("searchterm" + i, searchTerm);
            }
        }
        this.addOption("city", this.selectedCity);
        this.addOption("orgUnit", this.selectedOrgUnit);
        this.addOption("region", this.selectedRegion);
        this.addOption("market", this.selectedMarket);
        this.addOption("practice", this.selectedPractice);
        this.addOption("subpractice", this.selectedSubPractice);
        this.addOption("agg", this.selectedAggregation);
        this.addOption("resourcemanager", this.selectedResourceManager);
    }

    private callFiltered(operation: string) {
        this.buildFilters();
        switch (operation) {
            case "export":
                this.messageService.exportRequest(this.filterQuery);
                break;
            case "apply":
                this.messageService.applyRequest(this.filterQuery);
                break;
        }
    }

    ngOnDestroy() {
    }
}