import { Component, OnDestroy, OnInit, EventEmitter, Output, NgZone } from '@angular/core';
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
    inputs: [
        'mode',
        'applyTrigger'
    ],
})
export class ResourceFiltersComponent implements OnDestroy, OnInit {

    @Output() applyFiltersRequested: EventEmitter<any>;

    visible: boolean = true;

    set mode(v: string) {
        if (v) {
            this._mode = v;
        }
        this.basicMode = v && v == 'basic' || !v;
    } 
    get mode() {
        return this._mode;
    }
    _mode: string = 'basic';
    basicMode: boolean = true;

    set applyTrigger(v: number) {
        this._applyTrigger = v;
        if (!this.basicMode && v) {
            this.apply();
        }
    }
    _applyTrigger: number;

    selectedCity: number[];
    selectedHomeCity: number[];
    selectedOrgUnit: number[];
    selectedRegion: number[];
    selectedPractice: number[];
    selectedSubPractice: number[];
    selectedAggregation: TimeAggregation;
    selectedResourceManager: number[];
    selectedPosition: number[];

    citySelector: any;
    homeCitySelector: any;
    orgUnitSelector: any;
    regionSelector: any;
    practiceSelector: any;
    subPracticeSelector: any;
    resourceManagerSelector: any;
    positionSelector: any;

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

    clearFilters() {
        this.selectedCity = null;
        this.selectedHomeCity = null;
        this.selectedOrgUnit = null;
        this.selectedRegion = null;
        this.selectedPractice = null;
        this.selectedSubPractice = null;
        this.selectedAggregation = TimeAggregation.Weekly;
        this.selectedResourceManager = null;
        this.selectedPosition = null;
    }

    clear() {
        this.clearFilters();
        this.tags.clear();

        this.messageService.resourceFilterChange('cleared', {
            aggregation: this.selectedAggregation
        })
    }

    apply() {
        this.buildFilters();
        this.saveFilters();
        this.messageService.resourceFilterChange('applied', {
            aggregation: this.selectedAggregation
        })

        this.applyFiltersRequested.emit(this.filterQuery);
    }

    constructor(
        private messageService: MessageService,
        private optionService: OptionService,
        private localStorageService: LocalStorageService    ) {

        this.applyFiltersRequested = new EventEmitter<any>();

        this.messageService.onFilterPanelToggled(state => {
            if (this.basicMode) {
                this.visible = !this.visible
            }
        });

        this.messageService.onFilteredRequested(operation => this.callFiltered(operation));

        this.messageService.onResourceFilterChanged(filterInfo => {
            if (!this.basicMode) {
                switch (filterInfo.type) {
                    case 'applied':
                        this.setFilters();
                        break;
                }
            }
        });


    }

    setFilters() {

        this.clearFilters();

        this.citySelector = this.optionService.initObservableSelector(
            `.${this._mode} .city-selector`,
            OptionType.City,
            value => {
                this.selectedCity = value;
            },
            'previousSelectedCity'
        );
        this.homeCitySelector = this.optionService.initObservableSelector(
            `.${this._mode} .homeCity-selector`,
            OptionType.HomeCity,
            value => {
                this.selectedHomeCity = value;
            },
            'previousSelectedHomeCity'
        );
        this.orgUnitSelector = this.optionService.initObservableSelector(
            `.${this._mode} .orgUnit-selector`,
            OptionType.OrgUnit,
            value => {
                this.selectedOrgUnit = value;
            },
            'previousSelectedOrgUnit'
        );
        this.regionSelector = this.optionService.initObservableSelector(
            `.${this._mode} .region-selector`,
            OptionType.Region,
            value => {
                this.selectedRegion = value;
            },
            'previousSelectedRegion'
        );
        this.practiceSelector = this.optionService.initObservableSelector(
            `.${this._mode} .practice-selector`,
            OptionType.Practice,
            value => {
                this.selectedPractice = value;
                ;
            }
            , 'previousSelectedPractice'
        );
        this.subPracticeSelector = this.optionService.initObservableSelector(
            `.${this._mode} .subPractice-selector`,
            OptionType.SubPractice,
            value => {
                this.selectedSubPractice = value;
            },
            'previousSelectedSubPractice'
        );
        this.resourceManagerSelector = this.optionService.initObservableSelector(
            `.${this._mode} .resourceManager-selector`,
            OptionType.ResourceManager,
            value => {
                this.selectedResourceManager = value;
            },
            'previousSelectedResourceManager'
        );
        this.positionSelector = this.optionService.initObservableSelector(
            `.${this._mode} .position-selector`,
            OptionType.Position,
            value => {
                this.selectedPosition = value;
            },
            'previousSelectedPosition'
        );
    }

    ngOnInit() {

        this.tags = this.optionService.initTags(".myTags", 3);

        this.messageService.onCategoriesLoaded(() => {

            this.setFilters();

            if (this.basicMode && (this.selectedCity || this.selectedHomeCity || this.selectedOrgUnit || this.selectedRegion ||
                this.selectedPractice || this.selectedSubPractice || this.selectedResourceManager || this.selectedPosition)) {
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
        this.addOption("title", this.selectedPosition);
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
        this.localStorageService.set("previousSelectedPosition", this.selectedPosition)
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