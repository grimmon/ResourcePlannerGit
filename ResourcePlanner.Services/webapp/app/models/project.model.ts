import { Assignment, TimeDataPage } from "./"

export class ProjectPage extends TimeDataPage {
    ProjectInfo: ProjectInfo;
    ProjectResource: ProjectResource[];
}

export class ProjectResource {
    ResourceId: number;
    FirstName: string;
    LastName: string;
    Position: string;
    CostRate: number;
    TotalForecastHours: number;
    TotalResourceHours: number;
    Assignments: Assignment[];
}

export class ProjectInfo {
    ProjectName: string;
    ProjectNumber: string;
    Offering: string;
    WBSCode: string;
    Description: string;
    URL: string;
    ProjectManagerFirstName: string;
    ProjectManagerLastName: string;
    StartDate: string;
    EndDate: string;
}

export class ProjectDetail {
    ProjectId: number;
    ProjectName: string;
    FirstName: string;
    LastName: string;
    Customer: string;
    WBSElement: string;
    Description: string;
    OpportunityOwnerFirstName: string;
    OpportunityOwnerLastName: string;
    ProjectManagerFirstName: string;
    ProjectManagerLastName: string;
    Assignments: Assignment[];
    ProjectMasterId: number;
}

export class ProjectDetailRow {
    Id: number;
    ProjectName: string;
    Client: string;
    Description: string;
    WBSElement: string;
    OpportunityOwner: string;
    ProjectManager: string;
    Assignments: Assignment[];
    ProjectMasterId: number;

    public constructor(projectDetail: ProjectDetail) {
        this.Id = projectDetail.ProjectMasterId;
        this.ProjectName = projectDetail.ProjectName;
        this.Client = projectDetail.Customer;
        this.Description = projectDetail.Description;
        this.WBSElement = projectDetail.WBSElement;
        this.OpportunityOwner = this.getName(projectDetail.OpportunityOwnerLastName, projectDetail.OpportunityOwnerFirstName);
        this.ProjectManager = this.getName(projectDetail.ProjectManagerLastName, projectDetail.ProjectManagerFirstName);
        this.ProjectMasterId = projectDetail.ProjectMasterId;
    }

    private getName(last: string, first: string): string {
        return (last ? last + ", " : last) + first;
    }
}

export class AddProject {
    ProjectName: string;
    CustomerId: number;
    CustomerName: string;
    Description: string;
    StartDate: string;
    EndDate: string;
    OpportunityOwnerId: number;
    ProjectManagerId: number;

    public constructor(
        fields?: {
            ProjectName?: string,
            CustomerId?: number,
            CustomerName?: string,
            Description?: string,
            StartDate?: string,
            EndDate?: string,
            OpportunityOwnerId?: number,
            ProjectManagerId?: number,
        }) {
        if (fields) Object.assign(this, fields);
    }
}

export class ProjectResourceRow {
    Id: number;
    ResourceName: string;
    Position: string;
    CostRate: number;
    TotalForecastHours: number;
    TotalResourceHours: number;
    Assignments: Assignment[];

    public constructor(projectResouce: ProjectResource) {
        this.Id = projectResouce.ResourceId;
        this.ResourceName = this.getName(projectResouce.LastName, projectResouce.FirstName);
        this.CostRate = projectResouce.CostRate;
        this.Position = projectResouce.Position;
        this.TotalForecastHours = projectResouce.TotalForecastHours;
        this.TotalResourceHours = projectResouce.TotalResourceHours;
    }

    private getName(last: string, first: string): string {
        return (last ? last + ", " : last) + first;
    }
}
