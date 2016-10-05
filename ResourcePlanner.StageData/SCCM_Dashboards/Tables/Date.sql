CREATE TABLE [SCCM_Dashboards].[Date] (
    [Date_Key]                    INT          NOT NULL,
    [Calendar_Date]               DATE         NOT NULL,
    [Calendar_Date_Time]          DATETIME     NOT NULL,
    [Calendar_Date_Name]          VARCHAR (25) NOT NULL,
    [Calendar_Extended_Date_Name] VARCHAR (50) NOT NULL,
    [Calendar_Year_Number]        SMALLINT     NOT NULL,
    [Calendar_Year_Name]          VARCHAR (25) NOT NULL,
    [Calendar_Quarter_Number]     TINYINT      NOT NULL,
    [Calendar_Quarter_Name]       VARCHAR (25) NOT NULL,
    [Calendar_Month_Number]       TINYINT      NOT NULL,
    [Calendar_Month_Name]         VARCHAR (25) NOT NULL,
    [Calendar_Week_Day_Number]    TINYINT      NOT NULL,
    [Calendar_Week_Day_Name]      VARCHAR (25) NOT NULL,
    [Calendar_Week_Number]        TINYINT      NOT NULL,
    [Calendar_Week_Name]          VARCHAR (25) NOT NULL,
    [Calendar_Week_Range_Name]    VARCHAR (50) NOT NULL,
    [Is_Week_Day]                 BIT          NOT NULL,
    [Is_Weekend]                  BIT          NOT NULL,
    [SCCM_Snapshot]               BIT          NOT NULL,
    [Insert_Date]                 DATETIME     NOT NULL,
    [Update_Date]                 DATETIME     NULL
);

