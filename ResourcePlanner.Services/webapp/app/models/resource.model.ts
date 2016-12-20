import { Assignment, ProjectDetail } from "./"

export enum TimeAggregation {
    Daily,
    Weekly,
    Monthly,
    Quarterly
}

export class DataPage {
    PageSize: number;
    PageNum: number;
    TotalRowCount: number;
}
export class TimeDataPage extends DataPage {
    TimeScale: TimeAggregation;
    TimePeriods: string[];
}

export class ResourcePage extends TimeDataPage {
    Resources: Resource[];
}

export class DetailPage extends TimeDataPage{
    ResourceInfo: ResourceInfo;
    Projects: ProjectDetail[];
}

export class ResourceInfo {
    ResourceId: number;
    LastName: string;
    FirstName: string;
    SubPractice: string;
    SubPracticeId: number;
    Practice: string;
    PracticeId: number;
    Position: string;
    PositionId: number;
    OrgUnit: string;
    OrgUnitId: number;
    Region: string;
    RegionId: number;
    Market: string;
    MarketId: number;
    City: string;
    CityId: number;
    ManagerFirstName: string;
    ManagerLastName: string;
}

export class Resource {
    ResourceId: number;
    FirstName: string;
    LastName: string;
    Position: string;
    City: string;
    Practice: string;
    SubPractice: string;

    ResourceManagerLastName: string;
    ResourceManagerFirstName: string;

    Assignments: Assignment[];
}

export class ResourceRequest {
    ResourceId:      number;
    ProjectMasterId: number;
    StartDate:       string;
    EndDate:         string;
    Hours:           number;
    Comments:        string;

    public constructor(
        fields?: {
            ResourceId?: number,
            ProjectMasterId?: number,
            StartDate?: string,
            EndDate?: string,
            Hours?: number,
            Comments?: string
        }) {
        if (fields) Object.assign(this, fields);
    }
}

export class ResourceRow {
    Id: number;
    ResourceName: string;
    City: string;
    Position: string;
    Practice: string;
    SubPractice: string;
    ResourceManager: string;

    public constructor(resource: Resource) {
        this.Id = resource.ResourceId;
        this.ResourceName = this.getName(resource.LastName, resource.FirstName);
        this.City = resource.City;
        this.Position = resource.Position;
        this.Practice = resource.Practice;
        this.SubPractice = resource.SubPractice;
        this.ResourceManager = this.getName(resource.ResourceManagerLastName, resource.ResourceManagerFirstName);
    }

    private getName(last: string, first: string): string {
        return (last ? last + ", " : last) + first;
    }
}