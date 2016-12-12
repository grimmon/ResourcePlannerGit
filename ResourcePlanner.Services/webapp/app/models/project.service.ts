import { Injectable } from '@angular/core';
import { ProjectResource } from './project.model';
import { CONFIG, ServerService } from '../core';

@Injectable()
export class ProjectService {

    constructor(
        private serverService: ServerService) {
    }

    addProject(project: ProjectResource) {
        return this.serverService.add<ProjectResource>(CONFIG.urls.projectAdd, project);
    }

    //deleteProject(project: ProjectResource) {
    //    return this.serverService.delete<ProjectResource>(CONFIG.urls.projects, project.ProjectId);
    //}

    getProjects(queryString: string) {
        return this.serverService.get<ProjectResource[]>(CONFIG.urls.projects + queryString);
    }

    getProject(id: number) {
        return this.serverService.get<ProjectResource>(`${CONFIG.urls.project}/${id}`);
    }

    //updateProject(project: ProjectResource) {
    //    return this.serverService.update<ProjectResource>(CONFIG.urls.projects, project, project.ProjectId);
    //}
}