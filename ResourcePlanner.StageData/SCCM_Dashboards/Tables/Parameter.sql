CREATE TABLE [SCCM_Dashboards].[Parameter] (
    [Parameter_Key] INT           NOT NULL,
    [Subject]       VARCHAR (50)  NOT NULL,
    [Name]          VARCHAR (50)  NOT NULL,
    [Description]   VARCHAR (200) NULL,
    [Value]         VARCHAR (50)  NOT NULL,
    [Insert_Date]   DATETIME      NOT NULL,
    [Update_Date]   DATETIME      NULL
);

