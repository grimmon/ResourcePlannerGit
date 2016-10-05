CREATE TABLE [Dimension].[Project_Resource] (
    [Project_Resource_Key]    INT           NOT NULL,
    [Contract_Number]         VARCHAR (20)  NOT NULL,
    [Contract_Name]           VARCHAR (100) NOT NULL,
    [WBS_Element]             VARCHAR (30)  NOT NULL,
    [WBS_Element_Description] VARCHAR (100) NOT NULL,
    [Material_Code]           VARCHAR (20)  NOT NULL,
    [Material_Name]           VARCHAR (100) NOT NULL,
    [Bill_Rate]               MONEY         NOT NULL,
    [Overtime_Rate]           MONEY         NOT NULL,
    [Non_Billable_Rate]       MONEY         NOT NULL,
    [Insert_Date]             DATETIME      NOT NULL,
    [Update_Date]             DATETIME      NULL,
    [Effective_Date]          DATETIME      NULL
);

