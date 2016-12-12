import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Resource, ResourcePage, DetailPage } from './resource.model';
import { CONFIG, ServerService } from '../core';

@Injectable()
export class ResourceService {

    constructor(
        private serverService: ServerService) {
    }

    addResource(resource: Resource) {
        return this.serverService.add<Resource>(CONFIG.urls.resources, resource);
    }

    deleteResource(resource: Resource) {
        return this.serverService.delete<Resource>(CONFIG.urls.resources, resource.ResourceId);
    }

    getResourcePage(queryString: string) {
        var res = this.serverService.get<ResourcePage>(CONFIG.urls.resources + queryString);
        return res || Observable.of(new ResourcePage());
    }

    getResourceDetailPage(queryString: string) {
        var res = this.serverService.get<DetailPage>(CONFIG.urls.resourceDetail + queryString);
        return res || Observable.of(new DetailPage());
    }

    getResource(id: number) {
        return this.serverService.get<Resource>(`${CONFIG.urls.resources}/${id}`);
    }

    updateResource(resource: Resource) {
        return this.serverService.update<Resource>(CONFIG.urls.resources, resource, resource.ResourceId);
    }

    export(query: string) {
        var html = `<iframe frameborder="0" scrolling="no" src="${CONFIG.urls.resourceExport + query}" id="myFrame"></iframe>`;
        alert('Requested to do export. ResourceList' + html);
        $(html).appendTo('body');
    }
}