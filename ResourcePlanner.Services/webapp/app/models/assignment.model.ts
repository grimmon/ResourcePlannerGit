export class Assignment {
    ProjectName: string;
    TimePeriod: string;
    ForecastHours: number;
    ActualHours: number;
    ResourceHours: number;
}

export class AddAssignments {
    resourceIds: number[];
    projectId: number;
    hoursPerDay: number;
    startDate: string;
    endDate: string;
    daysOfWeek: string[];
}