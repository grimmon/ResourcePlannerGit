import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from 'angular-2-local-storage';
import { MessageService } from '../../core';
import { Option, CategoryOption, OptionService, OptionType, TimeAggregation } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'resource-filters',
    templateUrl: 'resourceFilters.component.html',
    styleUrls: ['resourceFilters.component.css'],
})
export class ResourceFiltersComponent implements OnDestroy, OnInit {

    @Output() applyFiltersRequested: EventEmitter<any>;

    visible: boolean = true;

    selectedCity: number[];
    selectedHomeCity: number[];
    selectedOrgUnit: number[];
    selectedRegion: number[];
    selectedPractice: number[];
    selectedSubPractice: number[];
    selectedAggregation: TimeAggregation;
    selectedResourceManager: number[];

    citySelector: any;
    homeCitySelector: any;
    orgUnitSelector: any;
    regionSelector: any;
    practiceSelector: any;
    subPracticeSelector: any;
    resourceManagerSelector: any;

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
        this.selectedCity = null;
        this.selectedHomeCity = null;
        this.selectedOrgUnit = null;
        this.selectedRegion = null;
        this.selectedPractice = null;
        this.selectedSubPractice = null;
        this.selectedAggregation = TimeAggregation.Weekly;
        this.selectedResourceManager = null;
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

    ngOnInit() {

        this.tags = this.optionService.initTags("#myTags", 3);   

        this.messageService.onCategoriesLoaded(() => {

            this.citySelector = this.optionService.initObservableSelector(
                ".city-selector",
                OptionType.City,
                value => {
                    this.selectedCity = value;
                },
                'previousSelectedCity'
            );
            this.homeCitySelector = this.optionService.initObservableSelector(
                ".homeCity-selector",
                OptionType.HomeCity,
                value => {
                    this.selectedHomeCity = value;
                },
                'previousSelectedHomeCity'
            );
            this.orgUnitSelector = this.optionService.initObservableSelector(
                ".orgUnit-selector",
                OptionType.OrgUnit,
                value => {
                    this.selectedOrgUnit = value;
                },
                'previousSelectedOrgUnit'
            );
            this.regionSelector = this.optionService.initObservableSelector(
                ".region-selector",
                OptionType.Region,
                value => {
                    this.selectedRegion = value;
                },
                'previousSelectedRegion'
            );
            this.practiceSelector = this.optionService.initObservableSelector(
                ".practice-selector",
                OptionType.Practice,
                value => {
                    this.selectedPractice = value;
                    ;
                }
                , 'previousSelectedPractice'
            );
            this.subPracticeSelector = this.optionService.initObservableSelector(
                ".subPractice-selector",
                OptionType.SubPractice,
                value => {
                    this.selectedSubPractice = value;
                },
                'previousSelectedSubPractice'
            );
            this.resourceManagerSelector = this.optionService.initObservableSelector(
                ".resourceManager-selector",
                OptionType.ResourceManager,
                value => {
                    this.selectedResourceManager = value;
                },
                'previousSelectedResourceManager'
            );
            if (this.selectedCity || this.selectedHomeCity || this.selectedOrgUnit || this.selectedRegion ||
                this.selectedPractice || this.selectedSubPractice || this.selectedResourceManager) {
                this.apply();
            }
        });

       

    }

    private tags: any;

    private filterQuery: string;

    private addFilter(key: string, values: any) {

        var iteratedValues = "";
        var iterator = 0;
        for (let value of values) {
            if (iterator > 0) {
                iteratedValues += ',' + value;
            }
            else {
                iteratedValues += value;
            }
            iterator++;
        }
        this.filterQuery += (this.filterQuery ? "&" : "") + key + "=" + iteratedValues;
    }

    private add(key: string, value: string) {
        if (value) {
            this.addFilter(key, value);
        }
    }

    private addOption(key: string, option: number[]) {
        if (option) {
            this.addFilter(key, option);
        }
    }

    private addAggOption(value: TimeAggregation) {
        this.filterQuery += (this.filterQuery ? "&agg=" : "agg=") + value;
    }

    private buildFilters() {
        this.filterQuery = this.tags.query();
        this.addOption("city", this.selectedCity);
        this.addOption("homeCity", this.selectedHomeCity);
        this.addOption("orgUnit", this.selectedOrgUnit);
        this.addOption("region", this.selectedRegion);
        this.addOption("practice", this.selectedPractice);
        this.addOption("subpractice", this.selectedSubPractice);
        this.addAggOption(this.selectedAggregation);
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