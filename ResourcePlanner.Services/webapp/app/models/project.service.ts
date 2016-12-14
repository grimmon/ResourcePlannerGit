import { Injectable } from '@angular/core';
import { ProjectResource, AddProject } from './project.model';
import { CONFIG, ServerService } from '../core';

@Injectable()
export class ProjectService {

    constructor(
        private serverService: ServerService) {
    }

    addProject(project: AddProject) {
        return this.serverService.postQuery<AddProject>(CONFIG.urls.projectAdd, project);
    }

    getProjects(queryString: string) {
        return this.serverService.get<ProjectResource[]>(CONFIG.urls.projectView + queryString);
    }

    getProject(id: number) {
        return this.serverService.get<ProjectResource>(`${CONFIG.urls.project}/${id}`);
    }
}