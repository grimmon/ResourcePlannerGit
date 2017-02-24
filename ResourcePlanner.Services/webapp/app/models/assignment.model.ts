export class Assignment {
    ProjectName: string;
    TimePeriod: string;
    ForecastHours: number;
    ActualHours: number;
    ResourceHours: number;
    SoftResourceHours: number;
}

export class GetAssignments {
    TotalHours: number;
    SundayHours: number;
    MondayHours: number;
    TuesdayHours: number;
    WednesdayHours: number;
    ThursdayHours: number;
    FridayHours: number;
    SaturdayHours: number;
    StartDate: string;
    EndDate: string;
    DateName: string;
}

export class AddAssignments extends GetAssignments {
    resourceIds: number[];
    projectMasterId: number;
    hoursPerWeek: number;
    startDate: string;
    endDate: string;
}

export class UpdateAssignment extends GetAssignments {
    resourceId: number;
    projectMasterId: number;
    hoursPerWeek: number;
    startDate: string;
    endDate: string;
}