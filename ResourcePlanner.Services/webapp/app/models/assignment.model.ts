export class Assignment {
    ProjectName: string;
    TimePeriod: string;
    ForecastHours: number;
    ActualHours: number;
    ResourceHours: number;
}

export class AddAssignments {
    ResourceIds: number[];
    ProjectId: number;
    Hours: number;
    StartDate: Date;
    EndDate: Date;
    DaysOfWeek: number;
}