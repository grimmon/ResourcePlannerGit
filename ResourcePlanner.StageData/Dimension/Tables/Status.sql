CREATE TABLE [Dimension].[Status] (
    [Status_Key]      INT          NOT NULL,
    [Status_Category] VARCHAR (50) NOT NULL,
    [Status_Code]     VARCHAR (10) NOT NULL,
    [Status_Name]     VARCHAR (50) NOT NULL,
    [Insert_Date]     DATETIME     NOT NULL,
    [Update_Date]     DATETIME     NULL
);

