CREATE TABLE [Dimension].[Task] (
    [Task_Key]                       INT          NOT NULL,
    [Task_Code]                      VARCHAR (20) NOT NULL,
    [Task_Name]                      VARCHAR (50) NOT NULL,
    [Task_Label]                     VARCHAR (73) NOT NULL,
    [Billable]                       BIT          NOT NULL,
    [Billable_Label]                 VARCHAR (20) NOT NULL,
    [Exclude_From_Utilization]       BIT          NOT NULL,
    [Exclude_From_Utilization_Label] VARCHAR (50) NOT NULL,
    [Insert_Date]                    DATETIME     NOT NULL,
    [Update_Date]                    DATETIME     NULL
);

