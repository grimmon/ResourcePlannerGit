import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'angular-2-local-storage';
import { Option, CategoryOption, OptionType, ColumnOption,  ResourcePageColumnType, DetailPageColumnType } from './option.model';
import { CONFIG, ServerService } from '../core';

@Injectable()
export class OptionService {

    orgUnits: Option[] = [];
    cities: Option[] = [];
    homeCities: Option[] = [];
    regions: Option[] = [];
    markets: Option[] = [];
    practices: Option[] = [];
    subPractices: Option[] = [];
    aggregations: Option[] = [];
    resourceManagers: Option[] = [];
    positions: Option[] = [];
    tasks: Option[] = [];
    resourcePageColumnOptions: ColumnOption[];
    detailPageColumnOptions: ColumnOption[];



    categories: Observable<any>;

    getOptionCategory(optionType: OptionType) {
        switch (optionType) {
            case OptionType.Position:
                return this.positions;
            case OptionType.OrgUnit:
                return this.orgUnits;
            case OptionType.City:
                return this.cities;
            case OptionType.HomeCity:
                return this.homeCities;
            case OptionType.Region:
                return this.regions;
            case OptionType.Market:
                return this.markets;
            case OptionType.Practice:
                return this.practices;
            case OptionType.SubPractice:
                return this.subPractices;
            case OptionType.agg:
                return this.aggregations;
            case OptionType.ResourceManager:
                return this.resourceManagers;
            case OptionType.Task:
                return this.tasks;
        }
    }

    getOptions(url: string, term: string): Observable<Option[]> {
        return this.serverService.get<Option[]>(url, "?searchTerm=" + term);
    }

    getResourceColumnOption(columnName: string) {
        return this.resourcePageColumnOptions.find(myObj => myObj.ColumnName == columnName).Hidden;
    }
    getResourceColumnOptionByField(fieldName: string) {
        return this.resourcePageColumnOptions.find(myObj => myObj.FieldName == fieldName).Hidden;
    }

    setResourceColumnOption(columnName: string) {
        this.resourcePageColumnOptions.find(myObj => myObj.ColumnName == columnName).Hidden = !this.resourcePageColumnOptions.find(myObj => myObj.ColumnName == columnName).Hidden;
        this.localStorageService.set('previousResourceColumns', this.resourcePageColumnOptions);
    }

    getDetailColumnOption(columnName: string) {
        return this.detailPageColumnOptions.find(myObj => myObj.ColumnName == columnName).Hidden;
    }
    getDetailColumnOptionByField(fieldName: string) {
        return this.detailPageColumnOptions.find(myObj => myObj.FieldName == fieldName).Hidden;
    }

    setDetailColumnOption(columnName: string) {
        this.detailPageColumnOptions.find(myObj => myObj.ColumnName == columnName).Hidden = !this.detailPageColumnOptions.find(myObj => myObj.ColumnName == columnName).Hidden;
        this.localStorageService.set('previousDetailColumns', this.detailPageColumnOptions);
    }

    initObservableSelector(selector: string, optionType: OptionType, handler: (value: any) => void): JQuery {
        var selectorObj: JQuery = $(selector);
        //if (previousValue !== null || previousValue != ""){
        //    var prevOptions = this.localStorageService.get(previousValue);
        //}

        this.categories.subscribe(categoryOptions => {
            selectorObj.select2({
                data: this.getOptionCategory(optionType).map(pos => {
                    return {
                        id: pos.Id,
                        text: pos.Name,
                    }
                })

            });
            selectorObj.on("change", () => {
                handler(selectorObj.select2('val'));
            });
        });
        return selectorObj;
    }


    initSelector(selector: string, source: any, initialValue: any, handler: (value: any) => void): any {
        var selectorObj: JQuery = $(selector),
            setValue = function (value: any) {
                selectorObj.val(value).trigger('change');
            };

        selectorObj
            .select2({
                data: source,
            })
            .on("change", () => {
                    handler(selectorObj.select2('val'));
                });
        setValue(initialValue);

        return {
            selector: selectorObj,
            set: setValue
        }
    }

    setSource(url: string) {
        var service = this;
        return function (term: string) {
            return service.getOptions(url, term);
        }
    }

    setListFormatter() {
        return function (data: any) {
            return data[this.displayPropertyName] ? "<span>" + data[this.displayPropertyName] + "</span>" : data;
        }
    };
    private displayPropertyName: string; // dummy


    initTags(selector: string, tagLimit?: number) {
        var tags: JQuery = $(selector);

        tags.tagit({
            fieldName: "searchbar",
            caseSensitive: false,
            readOnly: false,
            tagLimit: tagLimit || 3,
            placeholderText: "Search",
            afterTagAdded: function (event: any, ui: any) { this.placeholderText = null },
            onTagLimitExceeded: function (event: any, ui: any) {
                this.readOnly = true;
            }
        });

        return {
            tags: tags,
            clear: function () { tags.tagit("removeAll"); },
            query: function () { return tags.tagit("assignedTags").filter((tag:string) => tag ? true : false).map((tag: string, i: number) => "searchterm" + (i + 1) + "=" + tag).join('&'); }   
        }
    }

    constructor(
        private serverService: ServerService,
        private localStorageService: LocalStorageService   ) {
        this.createCategories();
        this.createColumnOptions();
    }

    private createCategories() {
        this.categories = this.serverService.get<CategoryOption[]>(CONFIG.urls.categoryOptions);

        this.categories
            .subscribe(categoryOptions => {
                this.orgUnits = this.createCategory(OptionType[OptionType.OrgUnit], categoryOptions);
                this.cities = this.createCategory(OptionType[OptionType.City], categoryOptions);
                this.homeCities = this.createCategory(OptionType[OptionType.HomeCity], categoryOptions);
                this.regions = this.createCategory(OptionType[OptionType.Region], categoryOptions);
                this.markets = this.createCategory(OptionType[OptionType.Market], categoryOptions);
                this.practices = this.createCategory(OptionType[OptionType.Practice], categoryOptions);
                this.subPractices = this.createCategory(OptionType[OptionType.SubPractice], categoryOptions);
                this.aggregations = this.createCategory(OptionType[OptionType.agg], categoryOptions, false);
                this.resourceManagers = this.createCategory(OptionType[OptionType.ResourceManager], categoryOptions);
                this.positions = this.createCategory(OptionType[OptionType.Position], categoryOptions, false);
                this.tasks = this.createCategory(OptionType[OptionType.Task], categoryOptions, false);
            });
       

    }

    private createColumnOptions() {
        let previousResourceColumns: ColumnOption[] = this.localStorageService.get('previousResourceColumns') as ColumnOption[];
        let previousDetailColumns: ColumnOption[] = this.localStorageService.get('previousDetailColumns') as ColumnOption[];

        var previousResourceColumnsExist = !(previousResourceColumns === null);
        var previousDetailColumnsExist = !(previousDetailColumns === null);

        this.resourcePageColumnOptions = [
            new ColumnOption({
                FieldName: 'ResourceName',
                ColumnName: 'Resource Name',
                Hidden: previousResourceColumnsExist ?
                    previousResourceColumns.find(myObj => myObj.ColumnName == 'Resource Name').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'Position',
                ColumnName: 'Position',
                Hidden: previousResourceColumnsExist ?
                    previousResourceColumns.find(myObj => myObj.ColumnName == 'Position').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'City',
                ColumnName: 'City',
                Hidden: previousResourceColumnsExist ?
                    previousResourceColumns.find(myObj => myObj.ColumnName == 'City').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'HomeCity',
                ColumnName: 'Home City',
                Hidden: previousResourceColumnsExist ?
                    previousResourceColumns.find(myObj => myObj.ColumnName == 'Home City').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'Practice',
                ColumnName: 'Practice',
                Hidden: previousResourceColumnsExist ?
                    previousResourceColumns.find(myObj => myObj.ColumnName == 'Practice').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'SubPractice',
                ColumnName: 'Sub-practice',
                Hidden: previousResourceColumnsExist ?
                    previousResourceColumns.find(myObj => myObj.ColumnName == 'Sub-practice').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'ResourceManager',
                ColumnName: 'Resource Mgr',
                Hidden: previousResourceColumnsExist ?
                    previousResourceColumns.find(myObj => myObj.ColumnName == 'Resource Mgr').Hidden : false
            })
        ];
        this.detailPageColumnOptions = [
            new ColumnOption({
                FieldName: 'ProjectName',
                ColumnName: 'Project Name',
                Hidden: previousDetailColumnsExist ?
                    previousDetailColumns.find(myObj => myObj.ColumnName == 'Project Name').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'ProjectNumber',
                ColumnName: 'Project Number',
                Hidden: previousDetailColumnsExist ?
                    previousDetailColumns.find(myObj => myObj.ColumnName == 'Project Number').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'WBSElement',
                ColumnName: 'WBS Element',
                Hidden: previousDetailColumnsExist ?
                    previousDetailColumns.find(myObj => myObj.ColumnName == 'WBS Element').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'Client',
                ColumnName: 'Client',
                Hidden: previousDetailColumnsExist ?
                    previousDetailColumns.find(myObj => myObj.ColumnName == 'Client').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'OpportunityOwner',
                ColumnName: 'Opportunity Owner',
                Hidden: previousDetailColumnsExist ?
                    previousDetailColumns.find(myObj => myObj.ColumnName == 'Opportunity Owner').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'ProjectManager',
                ColumnName: 'Project Manager',
                Hidden: previousDetailColumnsExist ?
                    previousDetailColumns.find(myObj => myObj.ColumnName == 'Project Manager').Hidden : false
            }),
            new ColumnOption({
                FieldName: 'Description',
                ColumnName: 'Description',
                Hidden: previousDetailColumnsExist ?
                    previousDetailColumns.find(myObj => myObj.ColumnName == 'Description').Hidden : false
            })
        ];
    }

    private createCategory(categoryName: string, categoryOptions: CategoryOption[], useNone: boolean = true): Option[] {
        var options = categoryOptions.filter(option => option.Category == categoryName).map(x => new Option({ Id: x.Id, Name: x.Name })).sort((a, b) => {
            var r = a.Name.localeCompare(b.Name);
            return r < 0 ? -1 : (r ? 1 : 0);
        });
        if (useNone) {
            var res: Option[] = [{ Id: -1, Name: 'Any' }];
            Array.prototype.push.apply(res, options);
            return res;
        }
        return options;
    }
}