export class Assignment {
    ProjectName: string;
    TimePeriod: string;
    ForecastHours: number;
    ActualHours: number;
    ResourceHours: number;
}

export class AddAssignments {
    resourceIds: number[];
    projectMasterId: number;
    hoursPerDay: number;
    startDate: string;
    endDate: string;
    daysOfWeek: string[];

    public constructor(
        fields?: {
            resourceIds?: number[],
            projectId?: number,
            hoursPerDay?: number,
            startDate?: string,
            endDate?: string,
            daysOfWeek?: string[],
        }) {
        if (fields) Object.assign(this, fields);
    }

}

export class UpdateAssignment {
    resourceId: number;
    projectMasterId: number;
    hoursPerDay: number;
    startDate: string;
    endDate: string;
    daysOfWeek: string[];

    public constructor(
        fields?: {
            resourceId?: number,
            projectId?: number,
            hoursPerDay?: number,
            startDate?: string,
            endDate?: string,
            daysOfWeek?: string[],
        }) {
        if (fields) Object.assign(this, fields);
    }

}