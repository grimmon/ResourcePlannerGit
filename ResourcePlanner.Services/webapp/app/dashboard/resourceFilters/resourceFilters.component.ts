import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from 'angular-2-local-storage';
import { MessageService } from '../../core';
import { Option, CategoryOption, OptionService, TimeAggregation } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'resource-filters',
    templateUrl: 'resourceFilters.component.html',
    styleUrls: ['resourceFilters.component.css'],
})
export class ResourceFiltersComponent implements OnDestroy, OnInit {

    @Output() applyFiltersRequested: EventEmitter<any>;

    visible: boolean = true;

    selectedCity: number;
    selectedHomeCity: number;
    selectedOrgUnit: number;
    selectedRegion: number;
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
    getHomeCities() {
        return this.optionService.homeCities;
    }

    getOrgUnits() {
        return this.optionService.orgUnits;
    }

    getRegions() {
        return this.optionService.regions;
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
        this.selectedHomeCity = -1;
        this.selectedOrgUnit = -1;
        this.selectedRegion = -1;
        this.selectedPractice = -1;
        this.selectedSubPractice = -1;
        this.selectedAggregation = TimeAggregation.Weekly;
        this.selectedResourceManager = -1;
        this.tags.clear();

        this.messageService.resourceFilterChange('cleared', {
            aggregation: this.selectedAggregation
        })
    }

    apply() {
        this.buildFilters();
        this.saveFilters();
        this.applyFiltersRequested.emit(this.filterQuery);
    }

    constructor(
        private messageService: MessageService,
        private optionService: OptionService,
        private localStorageService: LocalStorageService    ) {

        this.applyFiltersRequested = new EventEmitter<any>();

        this.messageService.onFilterPanelToggled(state => {
            this.visible = !this.visible
        });

        this.messageService.onFilteredRequested(operation => this.callFiltered(operation));

    }

    getPreviousFilters() {
        var previousSelectedCity = this.localStorageService.get('previousSelectedCity') as number;
        var previousSelectedHomeCity = this.localStorageService.get('previousSelectedHomeCity') as number;
        var previousSelectedOrgUnit = this.localStorageService.get('previousSelectedOrgUnit') as number;
        var previousSelectedRegion = this.localStorageService.get('previousSelectedRegion') as number;
        var previousSelectedPractice = this.localStorageService.get('previousSelectedPractice') as number;
        var previousSelectedSubPractice = this.localStorageService.get('previousSelectedSubPractice') as number;
        var previousSelectedAggregation = this.localStorageService.get('previousSelectedAggregation') as number;
        var previousSelectedResourceManager = this.localStorageService.get('previousSelectedResourceManager')as number;

        if (!(previousSelectedCity === null)) {
            this.selectedCity = previousSelectedCity;
        }
        if (!(previousSelectedHomeCity === null)) {
            this.selectedHomeCity = previousSelectedHomeCity;
        }
        if (!(previousSelectedOrgUnit === null)) {
            this.selectedOrgUnit = previousSelectedOrgUnit;
        }
        if (!(previousSelectedRegion === null)) {
            this.selectedRegion = previousSelectedRegion;
        }
        if (!(previousSelectedPractice === null)) {
            this.selectedPractice = previousSelectedPractice;

        }
        if (!(previousSelectedSubPractice === null)) {
            this.selectedSubPractice = previousSelectedSubPractice;
        }
        if (!(previousSelectedAggregation === null)) {
            this.selectedAggregation = previousSelectedAggregation;
        }
        if (!(previousSelectedResourceManager === null)) {
            this.selectedResourceManager = previousSelectedResourceManager;
        } 
    }

    ngOnInit() {
        this.tags = this.optionService.initTags("#myTags", 3);

        this.clear();
        this.getPreviousFilters();
    }

    private tags: any;

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
        this.filterQuery = this.tags.query();
        this.addOption("city", this.selectedCity);
        this.addOption("homeCity", this.selectedHomeCity);
        this.addOption("orgUnit", this.selectedOrgUnit);
        this.addOption("region", this.selectedRegion);
        this.addOption("practice", this.selectedPractice);
        this.addOption("subpractice", this.selectedSubPractice);
        this.addOption("agg", this.selectedAggregation);
        this.addOption("resourcemanager", this.selectedResourceManager);
    }

    private saveFilters() {
        this.localStorageService.set("previousSelectedCity", this.selectedCity);
        this.localStorageService.set("previousSelectedHomeCity", this.selectedHomeCity);
        this.localStorageService.set("previousSelectedOrgUnit", this.selectedOrgUnit);
        this.localStorageService.set("previousSelectedRegion", this.selectedRegion);
        this.localStorageService.set("previousSelectedPractice", this.selectedPractice);
        this.localStorageService.set("previousSelectedSubPractice", this.selectedSubPractice);
        this.localStorageService.set("previousSelectedAgg", this.selectedAggregation);
        this.localStorageService.set("previousSelectedResourceManager", this.selectedResourceManager);
    }

    private callFiltered(operation: string) {
        this.buildFilters();
        switch (operation) {
            case "export":
                this.messageService.exportRequest(this.filterQuery);
                break;
        }
    }

    ngOnDestroy() {
    }
}