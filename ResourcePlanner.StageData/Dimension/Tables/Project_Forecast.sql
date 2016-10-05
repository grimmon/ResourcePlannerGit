CREATE TABLE [Dimension].[Project_Forecast] (
    [Project_Forecast_Key] INT             NOT NULL,
    [Forecast_Code]        VARCHAR (10)    NOT NULL,
    [Forecast_Name]        VARCHAR (200)   NOT NULL,
    [Estimated_Start_Date] DATE            NOT NULL,
    [Estimated_End_Date]   DATE            NOT NULL,
    [Booked_Margin]        DECIMAL (12, 4) NOT NULL,
    [Forecast_Category]    VARCHAR (50)    NOT NULL,
    [Insert_Date]          DATETIME        NOT NULL,
    [Update_Date]          DATETIME        NULL
);

