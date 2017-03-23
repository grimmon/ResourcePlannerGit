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
            this.apply(false);
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

    selectorsInitialized: boolean = false;

    aggregationChange(newAggregation: any) {
        this.messageService.resourceFilterChange('aggregation', parseInt(newAggregation));
    }

    clearFilters() {
        this.selectedCity = null;
        this.selectedHomeCity = null;
        this.selectedOrgUnit = null;
        this.selectedRegion = null;
        this.selectedPractice = null;
        this.selectedSubPractice = null;
        this.selectedResourceManager = null;
        this.selectedPosition = null;

        this.selectedAggregation = TimeAggregation.Weekly;
    }

    setFilterValues() {
        this.setSelectorValue(this.citySelector, this.selectedCity);
        this.setSelectorValue(this.homeCitySelector, this.selectedHomeCity);
        this.setSelectorValue(this.orgUnitSelector, this.selectedOrgUnit);
        this.setSelectorValue(this.regionSelector, this.selectedRegion);
        this.setSelectorValue(this.practiceSelector, this.selectedPractice);
        this.setSelectorValue(this.subPracticeSelector, this.selectedSubPractice);
        this.setSelectorValue(this.resourceManagerSelector, this.selectedResourceManager);
        this.setSelectorValue(this.positionSelector, this.selectedPosition);
    }

    clear() {
        this.clearFilters();
        this.tags.clear();
        this.setFilterValues();
        this.reportFilterChange('cleared');
    }

    apply(force: boolean = true) {
        this.buildFilters();
        if (this.basicMode) {
            this.saveFilters();
        }
        this.reportFilterChange('applied');
        this.applyFiltersRequested.emit({
            filterQuery: this.filterQuery,
            force: force
        });
    }

    getAggregations() {
        return this.optionService.aggregations;
    }

    constructor(
        private messageService: MessageService,
        private optionService: OptionService,
        private localStorageService: LocalStorageService) {

        this.applyFiltersRequested = new EventEmitter<any>();

        this.messageService.onFilterPanelToggled(state => {
            if (this.basicMode) {
                this.visible = !this.visible
            }
        });

        this.messageService.onFilteredRequested(operation => {
            this.callFiltered(operation)
        });

        this.messageService.onResourceFilterChanged(filterInfo => {
            if (!this.basicMode && filterInfo.type == 'applied') {
                if (this.selectorsInitialized) {
                    if (filterInfo.value.basicMode) {
                        this.loadFilters();
                        this.setFilterValues();
                   }
                } else {
                    if (!filterInfo.value.basicMode) {
                        this.setFilters();
                        this.selectorsInitialized = true;
                    }
                }
            }
        });
    }

    reportFilterChange(type: string) {
        this.messageService.resourceFilterChange(type, {
            aggregation: this.selectedAggregation,
            mode: this.mode,
            basicMode: this.basicMode,
        });
    }

    setSelectorValue = function (selectorObj: any, value: any) {
        selectorObj.val(value || []).trigger('change');
    }

    setFilters() {
        this.clearFilters();

        this.tags = this.optionService.initTags(`.${this._mode} .myTags`, 3);

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

        //Load previous interval filter from localstorage

        if(this.basicMode){
            this.selectedAggregation = this.getPreviousAggFromStorage();
        }
    }

    getPreviousAggFromStorage(){
        let agg: TimeAggregation;
        try{
            let previousAggFromStorage = this.localStorageService.get("previousSelectedAgg");
            if(previousAggFromStorage){
                let previousAggAsInt = parseInt(previousAggFromStorage + "");
                let previousAggEnum = TimeAggregation[previousAggAsInt];
                agg =  TimeAggregation[previousAggEnum];
                this.messageService.resourceFilterChange('aggregation', previousAggAsInt);
            }else{
                agg = TimeAggregation.Weekly;
            }
        }catch (e){
            agg = TimeAggregation.Weekly;
        }

        return agg;
    }

    ngOnInit() {

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

    private buildFilters(useAggregation: boolean = true) {
        this.filterQuery = this.tags.query();
        this.addOption("city", this.selectedCity);
        this.addOption("homeCity", this.selectedHomeCity);
        this.addOption("orgUnit", this.selectedOrgUnit);
        this.addOption("region", this.selectedRegion);
        this.addOption("practice", this.selectedPractice);
        this.addOption("subpractice", this.selectedSubPractice);
        if (useAggregation) {
            this.addAggOption(this.selectedAggregation);
        }
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
        this.localStorageService.set("previousSelectedAgg", parseInt(this.selectedAggregation + ""));
        this.localStorageService.set("previousSelectedResourceManager", this.selectedResourceManager);
        this.localStorageService.set("previousSelectedPosition", this.selectedPosition)
    }

    private loadFilters() {
        this.selectedCity = this.optionService.getInitialValues("previousSelectedCity");
        this.selectedHomeCity = this.optionService.getInitialValues("previousSelectedHomeCity");
        this.selectedOrgUnit = this.optionService.getInitialValues("previousSelectedOrgUnit");
        this.selectedRegion = this.optionService.getInitialValues("previousSelectedRegion");
        this.selectedPractice = this.optionService.getInitialValues("previousSelectedPractice");
        this.selectedSubPractice = this.optionService.getInitialValues("previousSelectedSubPractice");
        this.selectedResourceManager = this.optionService.getInitialValues("previousSelectedResourceManager");
        this.selectedPosition = this.optionService.getInitialValues("previousSelectedPosition");
        if(this.basicMode){
            this.selectedAggregation = this.getPreviousAggFromStorage();
        }
    }

    private callFiltered(operation: any) {
        switch (operation.type) {
            case "export":
                if (this.basicMode) {
                    this.buildFilters(false);
                    var exportInfo = {
                        query: this.filterQuery,
                        callback: operation.callback,
                    }
                    this.messageService.exportRequest(exportInfo);
                }
                break;
        }
    }

    ngOnDestroy() {
    }
}