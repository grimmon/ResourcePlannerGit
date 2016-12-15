import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CONFIG, ServerService } from '../core';
import { Resource, ResourcePage, DetailPage } from './resource.model';
import { AddAssignments } from './assignment.model';

@Injectable()
export class ResourceService {

    constructor(
        private serverService: ServerService) {
    }

    addResource(resource: Resource) {
        return this.serverService.post<Resource>(CONFIG.urls.resources, resource);
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

    addAssignments(assignment: AddAssignments) {
        return this.serverService.postQuery<AddAssignments>(CONFIG.urls.assignmentAdd, assignment);
    }

    export(query: string) {
        var src = `${CONFIG.urls.resourceExport}${query.substr(0, 1) != '?' ? '?' : ''}${query}`,
            iframe = $('#exportIFrame');
        if (iframe.length == 0) {
            iframe = $(`<iframe frameborder="0" style="display:none" scrolling="no" src="about:blank" id="exportIFrame"></iframe>`);
            iframe.appendTo('body');
        }
        iframe.attr('src', src);
    }
}