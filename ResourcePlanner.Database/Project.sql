CREATE TABLE [dbo].[Project]
(
	[ProjectId] INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
	[ProjectKey] INT NOT NULL UNIQUE, 
	[ProjectNumber] VARCHAR(30) NOT NULL, 
	[ProjectName] VARCHAR(50) NOT NULL, 
	[WBSCode] VARCHAR(50) NOT NULL, 
	[CustomerCd] INT NOT NULL, 
	[Description] VARCHAR(100) NULL, 
	[OpportunityOwnerId] INT NULL, 
	[ProjectManagerId] INT NULL, 
	[StartDate] DATE NULL, 
	[EndDate] DATE NULL, 
	[Status] VARCHAR(10) NULL, 
	[Type] VARCHAR(10) NULL, 
	CONSTRAINT [FK_Project_OppOwner] FOREIGN KEY ([OpportunityOwnerId]) REFERENCES [dbo].[Resource]([ResourceId]),
	CONSTRAINT [FK_Project_ProjectManager] FOREIGN KEY ([ProjectManagerId]) REFERENCES [dbo].[Resource]([ResourceId]), 
	CONSTRAINT [FK_Project_Customer] FOREIGN KEY ([CustomerCd]) REFERENCES [dbo].[ReferenceCodeSet]([ReferenceId])
)
