CREATE TABLE [SCCM_Dashboards].[Region] (
    [Region_Key]    INT           NOT NULL,
    [Region_Code]   VARCHAR (10)  NOT NULL,
    [Region_Name]   VARCHAR (50)  NOT NULL,
    [Region_Label]  VARCHAR (100) NOT NULL,
    [Search_String] VARCHAR (10)  NOT NULL,
    [Insert_Date]   DATETIME      NOT NULL,
    [Update_Date]   DATETIME      NULL
);

