import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CONFIG, ServerService } from '../core';
import { Resource, ResourcePage, DetailPage, ResourceRequest, ResourceBreakdown } from './resource.model';
import { GetAssignments, AddAssignments, UpdateAssignment, DeleteAssignment } from './assignment.model';

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

    getResourceBreakdown(queryString: string) {
        var res = this.serverService.get<ResourceBreakdown>(CONFIG.urls.resourceBreakdown + queryString);
        return res || Observable.of(new ResourceBreakdown());
    }

    requestResource(resourceRequest: ResourceRequest) {
        return this.serverService.postQuery<ResourceRequest>(CONFIG.urls.requestResource, resourceRequest);
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

    updateAssignment(assignment: UpdateAssignment) {
        return this.serverService.postQuery<UpdateAssignment>(CONFIG.urls.assignmentUpdate, assignment);
    }

    getAssignment(assignment: UpdateAssignment) {
        var query = `?resourceId=${assignment.resourceId}&projectMasterId=${assignment.projectMasterId}&date=${assignment.startDate}`;
        return this.serverService.get<GetAssignments>(CONFIG.urls.assignmentGet + query);
    }

    deleteAssignment(assignment: DeleteAssignment) {
        return this.serverService.deleteQuery<DeleteAssignment>(CONFIG.urls.assignmentDelete, assignment);
    }

    export(query: string, callback: any) {
        console.log(query)
        var url = `${CONFIG.urls.resourceExport}${query.substr(0, 1) != '?' ? '?' : ''}${query}`;
        this.serverService.export(url).subscribe((response: any) => {
            if (response.byteLength > 0) {
                var win: any = window,
                    blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                win.saveAs(blob, `ResPlannerExport${(new Date()).toUTCString()}.xlsx`);
                callback();
            } else {
                callback();
                console.log('export get blob failed ')
            }
        });
    }
}