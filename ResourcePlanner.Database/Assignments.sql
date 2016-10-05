CREATE TABLE [dbo].[Assignments]
(
	[AssignmentId] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1), 
	[AssignmentKey] INT NOT NULL,
    [ResourceId] INT NOT NULL, 
    [ProjectId] INT NULL, 
    [IsSoftBooked] BIT NULL, 
    [IsForc] BIT NULL,
	[TotalHours] FLOAT NULL, 
    [HoursPerDay] FLOAT NULL, 
    [StartDate] DATE NULL, 
    [EndDate] DATE NULL, 
    [HourType] VARCHAR(20) NULL, 
    [Status] VARCHAR(10) NULL, 
    [Type] VARCHAR(10) NULL, 
    CONSTRAINT [FK_Assignments_Resource] FOREIGN KEY ([ResourceId]) REFERENCES [dbo].[Resource]([ResourceId]), 
    CONSTRAINT [FK_Assignments_Project] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Project]([ProjectId])
)
