CREATE TABLE [dbo].[ReferenceCodeSet]
(
	[ReferenceId] INT NOT NULL PRIMARY KEY, 
    [LabelText] VARCHAR(100) NOT NULL, 
    [CodeType] VARCHAR(20) NOT NULL, 
    [ExternalId] VARCHAR(50) NULL, 
    [Status] VARCHAR(10) NULL, 
    [Type] VARCHAR(10) NULL
)
