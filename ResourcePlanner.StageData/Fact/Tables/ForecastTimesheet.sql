CREATE TABLE [Fact].[ForecastTimesheet] (
    [ForecastTimesheet_Key] INT            NOT NULL,
    [Customer_Key]          INT            NOT NULL,
    [Employee_Key]          INT            NULL,
    [Employee_History_Key]  INT            NULL,
    [Date_Key]              INT            NOT NULL,
    [Project_Key]           INT            NOT NULL,
    [Billable_Hours]        DECIMAL (6, 2) NOT NULL,
    [Non_Billable_Hours]    DECIMAL (6, 2) NOT NULL,
    [OT_Billable_Hours]     DECIMAL (6, 2) NOT NULL,
    [Utilization_Target]    DECIMAL (5, 2) NOT NULL,
    [Insert_Date]           DATETIME       NOT NULL,
    [Update_Date]           DATETIME       NOT NULL
);

