CREATE TABLE [Dimension].[Cost_Element] (
    [Cost_Element_Key]         INT          NOT NULL,
    [Cost_Element_Code]        VARCHAR (20) NOT NULL,
    [Cost_Element_Description] VARCHAR (50) NOT NULL,
    [Cost_Element_Category]    VARCHAR (50) NOT NULL,
    [Forecast_Category]        VARCHAR (50) NOT NULL,
    [Insert_Date]              DATETIME     NOT NULL,
    [Update_Date]              DATETIME     NULL
);

