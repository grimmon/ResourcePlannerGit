import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Option, CategoryOption } from './option.model';
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

    getOptions(url: string, term: string): Observable<Option[]> {
        return this.serverService.get<Option[]>(url, "?searchTerm=" + term);
    }

    constructor(
        private serverService: ServerService) {

        this.createCategories();
    }

    private createCategories() {
        this.categories = this.serverService.get<CategoryOption[]>(CONFIG.urls.categoryOptions);

        this.categories
            .subscribe(categoryOptions => {
                this.orgUnits = this.createCategory('OrgUnit', categoryOptions);
                this.cities = this.createCategory('City', categoryOptions);
                this.regions = this.createCategory('Region', categoryOptions);
                this.markets = this.createCategory('Market', categoryOptions);
                this.practices = this.createCategory('Practice', categoryOptions);
                this.subPractices = this.createCategory('SubPractice', categoryOptions);
                this.aggregations = this.createCategory('agg', categoryOptions, false);
                this.resourceManagers = this.createCategory('ResourceManager', categoryOptions);
                this.positions = this.createCategory('Position', categoryOptions, false);
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