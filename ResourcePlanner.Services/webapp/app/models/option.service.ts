import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Option, CategoryOption, OptionType } from './option.model';
import { CONFIG, ServerService } from '../core';

@Injectable()
export class OptionService {

    orgUnits: Option[] = [];
    cities: Option[] = [];
    regions: Option[] = [];
    markets: Option[] = [];
    practices: Option[] = [];
    subPractices: Option[] = [];
    aggregations: Option[] = [];
    resourceManagers: Option[] = [];
    positions: Option[] = [];

    categories: Observable<any>;

    getOptionCategory(optionType: OptionType) {
        switch (optionType) {
            case OptionType.Position:
                return this.positions;
            case OptionType.OrgUnit:
                return this.orgUnits;
            case OptionType.City:
                return this.cities;
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
        }
    }

    getOptions(url: string, term: string): Observable<Option[]> {
        return this.serverService.get<Option[]>(url, "?searchTerm=" + term);
    }

    initObservableSelector(selector: string, optionType: OptionType, handler: (value: any) => void): JQuery {
        var selectorObj: JQuery = $(selector);

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


    initSelector(selector: string, source: any[], initialValue: string[], handler: (value: any) => void): JQuery {
        console.log('OptionType '+ OptionType[OptionType.Position])
        var selectorObj: JQuery = $(selector);

        selectorObj
            .select2({
                data: source
            }).on("change", () => {
                handler(selectorObj.select2('val'));
            });
        selectorObj.val(initialValue).trigger('change');

        return selectorObj;
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
        private serverService: ServerService) {

        this.createCategories();
    }

    private createCategories() {
        this.categories = this.serverService.get<CategoryOption[]>(CONFIG.urls.categoryOptions);

        this.categories
            .subscribe(categoryOptions => {
                this.orgUnits = this.createCategory(OptionType[OptionType.OrgUnit], categoryOptions);
                this.cities = this.createCategory(OptionType[OptionType.City], categoryOptions);
                this.regions = this.createCategory(OptionType[OptionType.Region], categoryOptions);
                this.markets = this.createCategory(OptionType[OptionType.Market], categoryOptions);
                this.practices = this.createCategory(OptionType[OptionType.Practice], categoryOptions);
                this.subPractices = this.createCategory(OptionType[OptionType.SubPractice], categoryOptions);
                this.aggregations = this.createCategory(OptionType[OptionType.agg], categoryOptions, false);
                this.resourceManagers = this.createCategory(OptionType[OptionType.ResourceManager], categoryOptions);
                this.positions = this.createCategory(OptionType[OptionType.Position], categoryOptions, false);
            });
    }

    private createCategory(categoryName: string, categoryOptions: CategoryOption[], useNone: boolean = true): Option[] {
        var options = categoryOptions.filter(option => option.Category == categoryName).map(x => new Option({ Id: x.Id, Name: x.Name })).sort((a, b) => {
            var r = a.Name.localeCompare(b.Name);
            return r < 0 ? -1 : (r ? 1 : 0);
        });
        if (useNone) {
            var res: Option[] = [{ Id: -1, Name: 'None' }];
            Array.prototype.push.apply(res, options);
            return res;
        }
        return options;
    }
}